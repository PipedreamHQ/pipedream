import { ConfigurationError } from "@pipedream/platform";
import constants from "./constants.mjs";

async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function emptyStrToUndefined(value) {
  const trimmed = typeof(value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

function parse(value) {
  const valueToParse = emptyStrToUndefined(value);
  if (typeof(valueToParse) === "object" || valueToParse === undefined) {
    return valueToParse;
  }
  try {
    return JSON.parse(valueToParse);
  } catch (e) {
    throw new ConfigurationError("Make sure the custom expression contains a valid object");
  }
}

function newestFirst(templates) {
  const changed = (t) => String(t.updated || t.created);
  return [
    ...(templates || []),
  ].sort((a, b) => changed(b).localeCompare(changed(a)));
}

// Shotstack keeps each value's JSON type, so a value takes the type of the template's own
// value: "5" fills a number as 5, "false" a true/false as false, JSON text a list or object.
function asTemplateType(value, templateValue) {
  if (typeof templateValue === "string") {
    return [
      "number",
      "boolean",
    ].includes(typeof value)
      ? String(value)
      : value;
  }
  if (typeof value === "string" && templateValue !== null && templateValue !== undefined) {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === typeof templateValue) {
        return parsed;
      }
    } catch (e) {
      // Not JSON: send the text as it is.
    }
  }
  return value;
}

// A merge list replaces the template's own list, so a field left out would render as a raw
// placeholder. Sends every template field, with the given value where there is one, plus any
// extra given fields. Takes name → value or Shotstack's own [{find, replace}] list; a name
// written as {{ TITLE }} counts as TITLE.
function mergeOverTemplate(templateMerge, fields) {
  const pairs = Array.isArray(fields)
    ? fields.map((f) => [
      f?.find,
      f?.replace,
    ])
    : Object.entries(fields || {});
  const given = new Map(pairs.map(([
    name,
    value,
  ]) => [
    String(name ?? "").replace(/[{}]/g, "")
      .trim(),
    value,
  ]));
  const isBlank = (v) => v === undefined || v === null || (typeof v === "string" && v.trim() === "");
  const merge = (templateMerge || [])
    .filter((f) => typeof f?.find === "string" && f.find !== "")
    .map(({
      find, replace,
    }) => ({
      find,
      replace: isBlank(given.get(find))
        ? replace
        : asTemplateType(given.get(find), replace),
    }));
  const known = new Set(merge.map((f) => f.find));
  return [
    ...merge,
    ...[
      ...given,
    ]
      .filter(([
        find,
      ]) => find && !known.has(find))
      .map(([
        find,
        replace,
      ]) => ({
        find,
        replace,
      })),
  ];
}

// Generation spends credits, so an empty prompt stops here rather than at Shotstack.
function generationBody({
  assetType, prompt, model, modelOptions, length,
}) {
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new ConfigurationError("Prompt is empty. Describe the asset to generate; for a speech model, give the words to speak.");
  }
  const options = parse(modelOptions);
  // Shotstack rejects empty options and a zero length, so those are left out.
  return {
    asset: {
      type: assetType,
      prompt: prompt.trim(),
      model: model?.trim() || undefined,
      options: options && Object.keys(options).length
        ? options
        : undefined,
    },
    length: length > 0
      ? length
      : undefined,
  };
}

function usableModels(models, assetType) {
  return (models || []).filter((m) => m?.model
    && m.available !== false
    && (!assetType || m.type === assetType));
}

function statusSummary(noun, {
  id, status, url, error,
}) {
  if (status === "done" && url) {
    return `${noun} ${id} is done: ${url}`;
  }
  return `${noun} ${id} is ${status}${error
    ? `: ${error}`
    : ""}`;
}

// Checks once, then every POLL_MS until isFinal or the wait runs out.
// Returns the last result either way.
async function poll({
  check, isFinal, seconds,
}) {
  const wait = Math.min(constants.MAX_WAIT_SECONDS, Math.max(0, Number(seconds) || 0));
  const deadline = Date.now() + wait * 1000;
  let result = await check();
  while (!isFinal(result) && Date.now() + constants.POLL_MS <= deadline) {
    await new Promise((resolve) => setTimeout(resolve, constants.POLL_MS));
    result = await check();
  }
  return result;
}

export default {
  parse,
  streamIterator,
  newestFirst,
  mergeOverTemplate,
  generationBody,
  usableModels,
  statusSummary,
  poll,
};
