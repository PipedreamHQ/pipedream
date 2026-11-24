import { ConfigurationError } from "@pipedream/platform";
import {
  DESIGNATIONS,
  NOT_CREATED_503_CODES,
} from "./constants.mjs";

/**
 * Parses a prop that holds a JSON array, given either as a string or as an already
 * parsed array.
 * @param {string|Array|undefined} value The prop value
 * @param {string} label The prop label, used in error messages
 * @returns {Array|undefined} The parsed array, or `undefined` when the prop is empty
 */
export function parseJsonArray(value, label) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch (err) {
      throw new ConfigurationError(`${label} must be a JSON array: ${err.message}`);
    }
  }
  if (!Array.isArray(parsed)) {
    throw new ConfigurationError(`${label} must be a JSON array`);
  }
  return parsed.map((item, index) => {
    const object = typeof item === "string"
      ? parseJsonObject(item, `${label} item ${index + 1}`)
      : item;
    if (!object || typeof object !== "object" || Array.isArray(object)) {
      throw new ConfigurationError(`${label} item ${index + 1} must be a JSON object`);
    }
    return object;
  });
}

function parseJsonObject(value, label) {
  try {
    return JSON.parse(value);
  } catch (err) {
    throw new ConfigurationError(`${label} must be a JSON object: ${err.message}`);
  }
}

/**
 * Checks the recipients of a document based send: each one needs `first_name`, `email`,
 * a valid `designation` and an `order`, and at least one must be a Signer.
 * @param {Array<object>} recipients The parsed recipients
 */
export function validateDocumentRecipients(recipients) {
  if (!recipients?.length) {
    throw new ConfigurationError("Recipients are required when sending a document.");
  }
  recipients.forEach((recipient, index) => {
    const position = `Recipient ${index + 1}`;
    if (!recipient.first_name || !recipient.email) {
      throw new ConfigurationError(`${position} needs \`first_name\` and \`email\`.`);
    }
    if (!DESIGNATIONS.includes(recipient.designation)) {
      throw new ConfigurationError(`${position} needs a \`designation\` of ${DESIGNATIONS.join(", ")}.`);
    }
    if (!Number.isInteger(Number(recipient.order)) || recipient.order === null
      || recipient.order === "") {
      throw new ConfigurationError(`${position} needs an integer \`order\`.`);
    }
  });
  if (!recipients.some(({ designation }) => designation === "Signer")) {
    throw new ConfigurationError("At least one recipient must have the designation `Signer`.");
  }
}

function describeTemplateUser(user) {
  const name = user.name || [
    user.first_name,
    user.last_name,
  ].filter(Boolean).join(" ");
  return `order ${user.order} (${user.designation}${name
    ? `, ${name}`
    : ""}, template_user_id ${user.id})`;
}

/**
 * Matches the given recipients to the users of a template the way Firma does on
 * create-and-send (`template_user_id` first, then `order`; CC recipients are never
 * matched and are added as extra CC recipients). Every Signer and Approver of the
 * template needs a recipient, otherwise Firma refuses the send; this check refuses it
 * before the call.
 *
 * When the template has exactly one Signer or Approver and exactly one non CC recipient
 * is given without `template_user_id` or `order`, that recipient is assigned to it.
 * @param {Array<object>} templateUsers The `recipients` of `GET /templates/{id}`
 * @param {Array<object>} recipients The parsed recipients
 * @returns {Array<object>} The recipients to send
 */
export function matchTemplateRecipients(templateUsers, recipients) {
  const users = (templateUsers || []).filter(({ designation }) => designation !== "CC");
  const nonCc = recipients.filter(({ designation }) => designation !== "CC");
  if (!users.length) {
    validateDocumentRecipients(recipients);
    return recipients;
  }
  if (users.length === 1 && nonCc.length === 1
    && !nonCc[0].template_user_id && (nonCc[0].order === undefined || nonCc[0].order === null)) {
    nonCc[0].template_user_id = users[0].id;
  }
  const userIds = new Set(users.map(({ id }) => id));
  const isMatch = (recipient, user) => {
    if (recipient.designation === "CC") return false;
    if (recipient.template_user_id) return recipient.template_user_id === user.id;
    if (recipient.id && userIds.has(recipient.id)) return recipient.id === user.id;
    return recipient.order !== undefined && recipient.order !== null
      && Number(recipient.order) === Number(user.order);
  };
  const missing = users.filter((user) => !recipients.some((r) => isMatch(r, user)));
  if (missing.length) {
    const roles = users.map(describeTemplateUser).join("; ");
    const lead = nonCc.length < users.length
      ? `This template has ${users.length} signing roles but ${nonCc.length} recipient(s) were given.`
      : "Some template roles have no matching recipient.";
    throw new ConfigurationError(`${lead} Firma needs a recipient for every Signer and Approver of the template, matched by \`template_user_id\` or \`order\`. Missing: ${missing.map(describeTemplateUser).join("; ")}. Template roles: ${roles}.`);
  }
  for (const recipient of nonCc) {
    if (!recipient.first_name || !recipient.email) {
      throw new ConfigurationError("Every recipient needs `first_name` and `email`.");
    }
  }
  return recipients;
}

/**
 * Classifies a failed create-and-send call so the caller never resends a legal document
 * blindly.
 * - `already-sent`: 409 ALREADY_SENT with `signing_request_id`; that request was sent.
 * - `kept`: 409 SEND_EFFECTS_EXIST with `signing_request_id`, or SEND_IN_PROGRESS; the
 *   request exists and its send started.
 * - `unknown`: no answer (network error or timeout), or a 5xx other than a 503 refusal
 *   with ANCHOR_DISABLED_EDGE or SEALS_DISABLED (502 PROXY_ERROR, 504, Firma's own 500);
 *   the request may have been created and sent.
 * - `not-created`: any other answer; nothing was kept.
 * @param {Error} err The error thrown by the request
 * @returns {{kind: string, signingRequestId?: string, status?: number, code?: string}}
 */
export function classifyCreateAndSendFailure(err) {
  const response = err?.response;
  if (!response || !response.status) {
    return {
      kind: "unknown",
    };
  }
  const { status } = response;
  const data = response.data && typeof response.data === "object"
    ? response.data
    : {};
  const code = typeof data.code === "string"
    ? data.code
    : undefined;
  const signingRequestId = typeof data.signing_request_id === "string"
    ? data.signing_request_id
    : undefined;
  if (status === 409) {
    if (code === "ALREADY_SENT" && signingRequestId) {
      return {
        kind: "already-sent",
        signingRequestId,
        status,
        code,
      };
    }
    if ((code === "SEND_EFFECTS_EXIST" && signingRequestId) || code === "SEND_IN_PROGRESS") {
      return {
        kind: "kept",
        signingRequestId,
        status,
        code,
      };
    }
    return {
      kind: "not-created",
      status,
      code,
    };
  }
  if (status < 500) {
    return {
      kind: "not-created",
      status,
      code,
    };
  }
  if (status === 503 && typeof data.error === "string" && NOT_CREATED_503_CODES.includes(code)) {
    return {
      kind: "not-created",
      status,
      code,
    };
  }
  return {
    kind: "unknown",
    status,
    code,
  };
}

/**
 * Builds the error message for a create-and-send failure that may have left a signing
 * request behind, or `null` when nothing was created and the original error stands.
 * @param {object} failure The result of `classifyCreateAndSendFailure`
 * @returns {string|null}
 */
export function describeCreateAndSendFailure(failure) {
  const answer = failure.status
    ? `HTTP ${failure.status}${failure.code
      ? ` ${failure.code}`
      : ""}`
    : "no response";
  if (failure.kind === "already-sent") {
    return `Firma reports that signing request ${failure.signingRequestId} was created and sent (${answer}). Do not run this step again; look it up with **Get Signing Request**.`;
  }
  if (failure.kind === "kept") {
    const which = failure.signingRequestId
      ? `signing request ${failure.signingRequestId}`
      : "the signing request";
    return `Firma kept ${which} and its send has started (${answer}). Do not run this step again, as a new run creates a second request; check it in Firma with **Get Signing Request** or **List Signing Requests**.`;
  }
  if (failure.kind === "unknown") {
    return `Firma did not confirm the result (${answer}). The signing request may have been created and sent. Check Firma (for example **List Signing Requests** filtered by name) before running this step again.`;
  }
  return null;
}
