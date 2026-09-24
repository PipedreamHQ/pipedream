import { ConfigurationError } from "@pipedream/platform";
import {
  isProfileAllowedForStandard,
  LIVE_GENERATE_PRESETS,
} from "@beliq/sdk";

/**
 * Coerce an object or JSON-string prop into a non-empty plain object, or
 * undefined when it is empty. A string that is not a JSON object is a
 * configuration mistake, so it throws naming the prop instead of silently
 * sending an empty object.
 */
export function parseObject(value, label) {
  let candidate = value;
  if (typeof candidate === "string") {
    const trimmed = candidate.trim();
    if (trimmed === "") {
      return undefined;
    }
    try {
      candidate = JSON.parse(trimmed);
    } catch {
      throw new ConfigurationError(`${label} is not valid JSON. Pass a JSON object, e.g. \`{ "number": "INV-1" }\`.`);
    }
  }
  if (candidate === undefined || candidate === null) {
    return undefined;
  }
  if (typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new ConfigurationError(`${label} must be a JSON object, not ${Array.isArray(candidate)
      ? "an array"
      : typeof candidate}.`);
  }
  return Object.keys(candidate).length > 0
    ? candidate
    : undefined;
}

/** Map a list of API values to Pipedream `{ label, value }` dropdown options. */
export function toOptions(values, labels) {
  return values.map((value) => ({
    label: labels[value] ?? value,
    value,
  }));
}

/** Resolve a Standard-dropdown value to the generate standard (and profile) it means. */
export function resolveGenerateTarget(value) {
  const preset = LIVE_GENERATE_PRESETS.find((p) => p.profile && p.id === value);
  if (preset) {
    return {
      standard: preset.standard,
      profile: preset.profile,
      output: preset.output,
    };
  }
  return {
    standard: value,
  };
}

/** Profiles only apply to the Factur-X / ZUGFeRD hybrid family. */
function isFacturxFamily(standardOrFormat) {
  return standardOrFormat === "facturx" || standardOrFormat === "zugferd";
}

/**
 * The chosen profile, or undefined when the standard does not accept it. One
 * dropdown covers both hybrid standards, but they do not share a profile set:
 * `extended-ctc-fr` is the AFNOR France CTC overlay and ZUGFeRD has no
 * counterpart, so that pair is a 422 PROFILE_STANDARD_MISMATCH.
 */
export function usableFacturxProfile(standard, profile) {
  if (!profile || !isFacturxFamily(standard)) return undefined;
  return isProfileAllowedForStandard(standard, profile)
    ? profile
    : undefined;
}
