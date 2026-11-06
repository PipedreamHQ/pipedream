import { ConfigurationError } from "@pipedream/platform";
import { isPlainObject } from "./utils.mjs";
import {
  AI_SCRAPER_ENGINE_SPECS, AI_SCRAPER_UULE_NAME_HEADER,
} from "./constants.mjs";

/**
 * Reject malformed location text without assuming a fixed geographic hierarchy.
 * Catalog membership and provider support remain the API's responsibility.
 *
 * @param {string} value Google canonical location name supplied by the caller.
 * @returns {string} Original location text without normalization.
 * @throws {ConfigurationError} If text contains invalid Unicode or empty levels.
 */
export function validateAiScraperLocation(value) {
  if (typeof value !== "string" || !value.trim() || value !== value.trim()
    || /[\p{Cc}\p{Cs}\p{Zl}\p{Zp}]/u.test(value)
    || /^[a-z][a-z\d+.-]*:\/\//i.test(value)
    || /^[-+]?\d+(?:\.\d+)?\s*,\s*[-+]?\d+(?:\.\d+)?$/.test(value)) {
    throw new ConfigurationError("Engine Options.location must be a Google canonical location name without surrounding whitespace, control characters, or URL syntax.");
  }
  for (const part of value.split(",")) {
    if (!part.trim()) {
      throw new ConfigurationError("Engine Options.location must not contain empty comma-separated geographic levels.");
    }
  }
  return value;
}

/**
 * Read the name from a known canonical-name UULE envelope, allowing extensions.
 *
 * @param {Buffer} bytes Decoded UULE bytes containing a length-delimited name.
 * @returns {string} Valid UTF-8 location name from the envelope.
 * @throws {Error} If the header, name length, or UTF-8 text is malformed.
 */
function readAiScraperUuleName(bytes) {
  for (let index = 0; index < AI_SCRAPER_UULE_NAME_HEADER.length; index++) {
    if (bytes[index] !== AI_SCRAPER_UULE_NAME_HEADER[index]) throw new Error();
  }
  let cursor = AI_SCRAPER_UULE_NAME_HEADER.length;
  let length = 0;
  let shift = 0;
  let byte;
  do {
    if (cursor >= bytes.length || shift > 49) throw new Error();
    byte = bytes[cursor++];
    length += (byte & 127) * (2 ** shift);
    shift += 7;
  } while (byte & 128);
  if (!Number.isSafeInteger(length) || length < 1 || length > bytes.length - cursor) {
    throw new Error();
  }
  const nameBytes = bytes.subarray(cursor, cursor + length);
  const name = nameBytes.toString("utf8");
  if (!Buffer.from(name, "utf8").equals(nameBytes)) throw new Error();
  return validateAiScraperLocation(name);
}

/**
 * Check known name and GPS UULE envelopes without rewriting the encoded value.
 * Percent escaping, Base64url, and optional correct padding are supported.
 *
 * @param {string} value Pre-encoded Google UULE value supplied by the caller.
 * @returns {string} Original validated value, including its original encoding.
 * @throws {ConfigurationError} If the encoding or known envelope is malformed.
 */
export function validateAiScraperUule(value) {
  try {
    if (typeof value !== "string" || !value || /\s/.test(value)) throw new Error();
    const decoded = decodeURIComponent(value);
    const match = /^([wa])\+([A-Za-z\d+/_-]+={0,2})$/.exec(decoded);
    if (!match) throw new Error();
    const payload = match[2];
    const unpadded = payload.replace(/=+$/, "");
    if (unpadded.length % 4 === 1 || (payload.includes("=") && payload.length % 4 !== 0)) {
      throw new Error();
    }
    const bytes = Buffer.from(payload, "base64");
    if (!bytes.length || bytes.toString("base64url") !== unpadded.replace(/\+/g, "-").replace(/\//g, "_")) {
      throw new Error();
    }
    if (match[1] === "w") {
      readAiScraperUuleName(bytes);
    } else {
      const text = bytes.toString("utf8");
      const coordinates = /\blatlng\s*:?\s*\{([^{}]+)\}/.exec(text)?.[1];
      const latitude = coordinates?.match(/\blatitude_e7\s*:\s*([-+]?\d+)(?=\s|[,;]|$)/)?.[1];
      const longitude = coordinates?.match(/\blongitude_e7\s*:\s*([-+]?\d+)(?=\s|[,;]|$)/)?.[1];
      if (!Buffer.from(text, "utf8").equals(bytes)
        || /[\p{Cc}\p{Cs}\p{Zl}\p{Zp}]/u.test(text.replace(/[\t\r\n]/g, ""))
        || !/\brole\s*:\s*\d+(?=\s|[,;]|$)/.test(text)
        || !/\bproducer\s*:\s*\d+(?=\s|[,;]|$)/.test(text)
        || latitude === undefined || longitude === undefined
        || Math.abs(Number(latitude)) > 900000000 || Math.abs(Number(longitude)) > 1800000000) {
        throw new Error();
      }
    }
    return value;
  } catch {
    throw new ConfigurationError("Engine Options.uule must contain a valid pre-encoded Google name (w+) or GPS (a+) UULE value, not a location name or search URL.");
  }
}

/**
 * Validate an HTTPS URL without credentials and preserve its exact input text.
 *
 * @param {*} value Candidate webhook or AI Mode URL.
 * @param {string} field Input label used in configuration errors.
 * @returns {string} Original validated URL without normalization.
 * @throws {ConfigurationError} If the URL is malformed or contains credentials.
 */
function validateHttpsUrl(value, field) {
  let parsed;
  try {
    if (typeof value !== "string" || !/^https:\/\//i.test(value)
      || /[\s\\]/.test(value)) {
      throw new Error();
    }
    parsed = new URL(value);
  } catch {
    throw new ConfigurationError(`${field} must be a valid HTTPS URL without credentials.`);
  }
  if (parsed.protocol !== "https:" || !parsed.hostname || parsed.username || parsed.password) {
    throw new ConfigurationError(`${field} must be a valid HTTPS URL without credentials.`);
  }
  return value;
}

/**
 * Build one engine-specific task payload using either prompt or URL mode.
 * Validate options and disable shopping by default for supported prompt actors.
 *
 * @param {object} options Configured action inputs.
 * @param {string} options.actor Supported AI Scraper actor identifier.
 * @param {string} [options.prompt] Nonempty prompt; required in prompt mode.
 * @param {string} [options.country] Two-letter country; required in prompt mode.
 * @param {string} [options.aiModeUrl] AI Mode link used instead of prompt inputs.
 * @param {object} [options.engineOptions={}] Options allowed by the chosen actor.
 * @param {string} [options.webhookUrl] Optional HTTPS callback receiver.
 * @returns {object} Validated API body containing actor, input, and any webhook.
 * @throws {ConfigurationError} If an input or option combination is invalid.
 */
export function buildAiScraperRequest({
  actor, prompt, country, aiModeUrl, engineOptions = {}, webhookUrl,
}) {
  if (typeof actor !== "string"
    || !Object.prototype.hasOwnProperty.call(AI_SCRAPER_ENGINE_SPECS, actor)) {
    throw new ConfigurationError("Select a supported AI Engine.");
  }
  if (!isPlainObject(engineOptions)) {
    throw new ConfigurationError("Engine Options must be a JSON object, such as {}.");
  }

  let input;
  if (aiModeUrl !== undefined) {
    if (actor !== "scraper.aimode") {
      throw new ConfigurationError("AI Mode URL is only supported by Google AI Mode.");
    }
    if (prompt !== undefined || country !== undefined || Reflect.ownKeys(engineOptions).length) {
      throw new ConfigurationError("AI Mode URL requires Prompt, Country, and Engine Options to be omitted.");
    }
    input = {
      url: validateHttpsUrl(aiModeUrl, "AI Mode URL"),
    };
  } else {
    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new ConfigurationError("Prompt must be a non-empty string in prompt mode.");
    }
    if (typeof country !== "string" || !/^[a-z]{2}$/i.test(country.trim())) {
      throw new ConfigurationError("Country must contain two letters, for example US.");
    }
    const {
      fields, required = [],
    } = AI_SCRAPER_ENGINE_SPECS[actor];
    input = {
      prompt,
      country: country.trim().toUpperCase(),
    };
    for (const field of Reflect.ownKeys(engineOptions)) {
      if (!Object.prototype.hasOwnProperty.call(fields, field)) {
        throw new ConfigurationError("Engine Options contains a field not supported by this AI Engine. See the documented options.");
      }
      const value = engineOptions[field];
      const rule = fields[field];
      if (Array.isArray(rule)) {
        if (!rule.includes(value)) {
          throw new ConfigurationError(`Engine Options.${field} must be one of: ${rule.join(", ")}.`);
        }
      } else if (typeof value !== rule || (rule === "string" && !value.trim())) {
        throw new ConfigurationError(`Engine Options.${field} must be ${rule === "string"
          ? "a non-empty string"
          : "a boolean"}.`);
      }
      input[field] = value;
    }
    for (const field of required) {
      if (!Object.prototype.hasOwnProperty.call(input, field)) {
        throw new ConfigurationError(`Engine Options.${field} is required for this AI Engine.`);
      }
    }
    if (input.location !== undefined && input.uule !== undefined) {
      throw new ConfigurationError("Engine Options.location and Engine Options.uule are mutually exclusive.");
    }
    if (input.location !== undefined) validateAiScraperLocation(input.location);
    if (input.uule !== undefined) validateAiScraperUule(input.uule);
    if (fields.shopping && input.shopping === undefined) {
      input.shopping = false;
    }
  }

  return {
    actor,
    input,
    ...(webhookUrl !== undefined && {
      webhook: {
        url: validateHttpsUrl(webhookUrl, "Webhook URL"),
      },
    }),
  };
}

/**
 * Validate a task identifier before encoding it as one URL path segment.
 *
 * @param {*} taskId Identifier supplied by the caller or creation response.
 * @returns {string} Trimmed identifier with valid Unicode and no dot segment.
 * @throws {ConfigurationError} If the identifier is empty or cannot be encoded.
 */
export function validateAiScraperTaskId(taskId) {
  if (typeof taskId !== "string" || !taskId.trim() || [
    ".",
    "..",
  ].includes(taskId.trim())) {
    throw new ConfigurationError("Task ID must be a non-empty identifier from an AI Scraper response.");
  }
  try {
    encodeURIComponent(taskId.trim());
  } catch {
    throw new ConfigurationError("Task ID must be a valid Unicode string.");
  }
  return taskId.trim();
}
