import { ConfigurationError } from "@pipedream/platform";

/**
 * Response-size control for Linear's list/search actions.
 *
 * These actions return every field of every record, which is fine for a workflow step
 * that picks out one value and catastrophic for an AI agent, where the whole response
 * enters the model's context and is re-read on every subsequent turn. Measured against
 * a real workspace: Get Teams ran 45 KB for 21 teams, List Projects 27 KB for 9, and
 * List Views spilled past the 25k-token MCP ceiling entirely — at which point the model
 * is handed a file path instead of the data and answers from nothing, while the tool
 * call still reports success.
 *
 * The `fields` prop is strictly ADDITIVE: leaving it blank returns exactly what these
 * actions return today, so existing workflows that reference `steps.x.$return_value[0]
 * .someField` keep working untouched. Only a caller that opts in gets a smaller payload.
 *
 * Projection happens after the fetch rather than in the GraphQL selection set, because
 * several of these actions go through the `@linear/sdk` client (`client().teams()`,
 * `.customViews()`, `.initiatives()`), which owns its own selection set and gives the
 * action no say in what comes back. Post-fetch projection is the one approach that works
 * uniformly across both the SDK-backed and raw-GraphQL actions.
 */

/**
 * Build the `fields` prop for an action.
 *
 * The prop SCHEMA lives in the app file's `propDefinitions` (shared by every action
 * that returns a record collection); this builds only the per-resource description
 * that overrides it, naming that resource's compact set and its expensive fields.
 *
 * @param {object} options
 * @param {string} options.resource - plural resource name used in the description ("teams")
 * @param {string[]} options.compact - what `compact` expands to
 * @param {string} options.guidance - one sentence naming this resource's expensive fields
 */
function fieldsDescription({
  resource, compact, guidance,
}) {
  return `Which fields to return for each of the ${resource}, as a comma-separated list (e.g. \`${compact.slice(0, 3).join(",")}\`) — use this to keep the response small enough to work with. Shorthand: \`compact\` returns \`${compact.join(",")}\`, which is what most questions about ${resource} need. ${guidance} The \`id\` is always returned, so the record can still be referenced by later actions without listing again. **Leave blank to return every field** (the default, and the largest possible response).`;
}

/** Parse the raw prop value into a field list, or undefined when blank. */
function parseFields(raw, compact) {
  const trimmed = typeof raw === "string"
    ? raw.trim()
    : "";
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.toLowerCase() === "compact") {
    return compact;
  }
  return trimmed
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);
}

/**
 * Narrow each record to the requested fields, returning the records untouched when
 * nothing was requested — that untouched path is the backwards-compatible default.
 *
 * Records may be SDK model instances rather than plain objects, whose fields live on
 * the prototype: `Object.keys()` on a `Team` instance returns far less than the JSON
 * a caller actually sees. Reading each field directly off the record handles both.
 */
function projectRecords(records, raw, {
  compact, known,
}) {
  const fields = parseFields(raw, compact);
  if (!fields?.length || !Array.isArray(records)) {
    return records;
  }

  // Validate against the documented field list UNION the keys the API actually
  // returned, so a field Linear adds after this component ships is accepted rather
  // than rejected as a typo. A plausible-but-wrong guess (`title` for a team, `name`
  // for an issue) fails loudly instead of returning records containing only an id.
  const returned = records.flatMap((record) => [
    ...Object.keys(record ?? {}),
    ...Object.keys(Object.getPrototypeOf(record ?? {}) ?? {}),
  ]);
  const valid = new Set([
    ...known,
    ...returned,
  ]);
  const unknown = fields.filter((field) => !valid.has(field));
  if (unknown.length) {
    throw new ConfigurationError(`Unknown value(s) in Fields: ${unknown.join(", ")}. Use \`compact\`, or a comma-separated subset of: ${known.join(", ")}. Leave Fields blank to return every field.`);
  }

  return records.map((record) => {
    // `id` is always kept: every follow-up action (update, comment, delete) needs it,
    // and an agent that trimmed it away would have to list all over again.
    const projected = {
      id: record?.id,
    };
    for (const field of fields) {
      if (field === "id") continue;
      const value = record?.[field];
      // Resolve @linear/sdk lazy relation getters. On an SDK model, `comment.user` is
      // a getter returning a LinearFetch promise rather than the user, so projecting
      // it directly emits a pending promise where the caller expects data. The
      // serialized record carries the same relation under `_user` / `_issue`, so fall
      // back to that and return it under the name the caller asked for.
      //
      // Falling back rather than skipping matters: the field lists accept `user`, so
      // skipping made `fields: "user"` validate happily and then return records
      // containing nothing but an id — a silent wrong answer, which is exactly the
      // failure mode this whole prop exists to prevent.
      const lazy = typeof value?.then === "function" || typeof value === "function";
      const resolved = lazy
        ? record?.[`_${field}`]
        : value;
      if (resolved === undefined) continue;
      projected[field] = resolved;
    }
    return projected;
  });
}

export default {
  fieldsDescription,
  parseFields,
  projectRecords,
};
