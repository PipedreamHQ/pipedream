import { BeliqApiError } from "@beliq/sdk";
import { MAX_REPORTED_FINDINGS } from "./constants.mjs";

/**
 * The specifics behind a beliq error, from the three shapes its envelope uses:
 * `validationResult.errors` (the failing rules of a 422 INVALID_INVOICE, whose
 * message alone is only "Generated invoice failed validation"), `fields` (the
 * request-schema problems of a 400 VALIDATION_ERROR) and `unmappablePaths` (what
 * a 422 CONVERSION_LOSSY_FAILCLOSED could not carry over).
 */
function describeDetails(details) {
  const findings = details?.validationResult?.errors;
  const fields = details?.fields;
  const unmappable = details?.unmappablePaths;
  let entries = [];
  if (Array.isArray(findings)) {
    entries = findings.map((f) => [
      f?.ruleId,
      f?.message,
      f?.location && `at ${f.location}`,
    ]);
  } else if (Array.isArray(fields)) {
    entries = fields.map((f) => [
      f?.path,
      f?.message,
    ]);
  } else if (Array.isArray(unmappable)) {
    entries = unmappable.map((xpath) => [
      xpath,
    ]);
  }
  if (entries.length === 0) return "";
  const shown = entries.slice(0, MAX_REPORTED_FINDINGS)
    .map((parts) => parts.filter(Boolean).join(" "));
  const hidden = entries.length - shown.length;
  return `: ${shown.join("; ")}${hidden > 0
    ? ` (+${hidden} more)`
    : ""}`;
}

/**
 * Turn an SDK error into a flat Error with a readable message. A BeliqApiError
 * carries the typed `{ code, message, details }` from beliq's error envelope;
 * anything else is surfaced verbatim. The stable `(CODE)` stays last so a
 * workflow can match on it.
 */
export function mapError(error) {
  if (error instanceof BeliqApiError) {
    const body = `${error.message}${describeDetails(error.details)}`;
    return new Error(error.code
      ? `${body} (${error.code})`
      : body);
  }
  return error instanceof Error
    ? error
    : new Error(String(error));
}
