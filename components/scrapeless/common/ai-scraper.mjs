import { ConfigurationError } from "@pipedream/platform";
import { isPlainObject } from "./utils.mjs";
import { AI_SCRAPER_ENGINE_SPECS } from "./constants.mjs";

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
    throw new ConfigurationError("Task ID must be a non-empty identifier from Create AI Scraper Task.");
  }
  try {
    encodeURIComponent(taskId.trim());
  } catch {
    throw new ConfigurationError("Task ID must be a valid Unicode string.");
  }
  return taskId.trim();
}
