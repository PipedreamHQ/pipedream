import { ConfigurationError } from "@pipedream/platform";
import {
  DESIGNATIONS,
  DOCX_CONTENT_TYPE,
  NOT_CREATED_503_CODES,
  PDF_CONTENT_TYPE,
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

function describeRecipient(recipient, index) {
  const who = [
    recipient.first_name,
    recipient.email,
  ].filter(Boolean).join(", ");
  return `${index + 1}${who
    ? ` (${who})`
    : ""}`;
}

/**
 * Whether a designation is CC. Firma compares it without regard to case.
 * @param {string} designation
 * @returns {boolean}
 */
export function isCcDesignation(designation) {
  return typeof designation === "string" && designation.toLowerCase() === "cc";
}

/**
 * Applies Firma's duplicate order rules for template sends: when two template roles share
 * an order, every Signer and Approver recipient needs `template_user_id`; and recipients
 * that share an order (a recipient without `order` counts as its position in the list)
 * each need `template_user_id`.
 * @param {Array<object>} users The Signers and Approvers of the template
 * @param {Array<object>} recipients The recipients to send
 * @param {string} roles The template roles, for the error message
 */
function checkDuplicateOrders(users, recipients, roles) {
  const actors = recipients
    .map((recipient, index) => ({
      recipient,
      index,
    }))
    .filter(({ recipient }) => !isCcDesignation(recipient.designation));
  const templateOrders = new Map();
  for (const user of users) {
    const order = user.order || 1;
    templateOrders.set(order, (templateOrders.get(order) || 0) + 1);
  }
  if ([
    ...templateOrders.values(),
  ].some((count) => count > 1)) {
    const lacking = actors.filter(({ recipient }) => !recipient.template_user_id);
    if (lacking.length) {
      throw new ConfigurationError(`Two or more template roles share an order, so every Signer and Approver recipient needs \`template_user_id\` (from **Get Template**). ${lacking.map(({
        recipient, index,
      }) => `Recipient ${describeRecipient(recipient, index)} has no \`template_user_id\``).join("; ")}. Template roles: ${roles}.`);
    }
  }
  const byOrder = new Map();
  for (const actor of actors) {
    const order = actor.recipient.order || actor.index + 1;
    if (!byOrder.has(order)) byOrder.set(order, []);
    byOrder.get(order).push(actor);
  }
  for (const [
    order,
    group,
  ] of byOrder) {
    const lacking = group.filter(({ recipient }) => !recipient.template_user_id);
    if (group.length > 1 && lacking.length) {
      throw new ConfigurationError(`Multiple recipients have order ${order} (a recipient without \`order\` counts as its position in the list). Recipients that share an order on a template send each need \`template_user_id\`; missing on: ${lacking.map(({
        recipient, index,
      }) => `Recipient ${describeRecipient(recipient, index)}`).join("; ")}. Template roles: ${roles}.`);
    }
  }
}

/**
 * Matches the given recipients to the users of a template the way Firma does on
 * create-and-send (`template_user_id` first, then a template user `id`, then `order`;
 * CC recipients are never matched and are added as extra CC recipients), and refuses
 * before the call what Firma would refuse or silently drop:
 * - a template that has roles sharing an order, or recipients sharing an order, without
 *   `template_user_id` (Firma refuses these);
 * - a Signer or Approver of the template with no recipient (Firma refuses);
 * - a non CC recipient that matches no template role, or matches a role already taken
 *   by an earlier recipient (Firma keeps the first match and drops the rest silently,
 *   so the document would go out without that person).
 *
 * When the template has exactly one Signer or Approver and exactly one non CC recipient
 * is given without `template_user_id` or `order`, that recipient is assigned to it.
 * @param {Array<object>} templateUsers The `recipients` of `GET /templates/{id}`
 * @param {Array<object>} recipients The parsed recipients
 * @returns {Array<object>} The recipients to send
 */
export function matchTemplateRecipients(templateUsers, recipients) {
  const users = (templateUsers || []).filter(({ designation }) => !isCcDesignation(designation));
  const nonCc = recipients.filter(({ designation }) => !isCcDesignation(designation));
  if (!users.length) {
    validateDocumentRecipients(recipients);
    return recipients;
  }
  if (users.length === 1 && nonCc.length === 1
    && !nonCc[0].template_user_id && (nonCc[0].order === undefined || nonCc[0].order === null)) {
    nonCc[0].template_user_id = users[0].id;
  }
  const roles = users.map(describeTemplateUser).join("; ");
  checkDuplicateOrders(users, recipients, roles);

  const userIds = new Set(users.map(({ id }) => id));
  const isMatch = (recipient, user) => {
    if (isCcDesignation(recipient.designation)) return false;
    if (recipient.template_user_id) return recipient.template_user_id === user.id;
    if (recipient.id && userIds.has(recipient.id)) return recipient.id === user.id;
    return recipient.order !== undefined && recipient.order !== null
      && Number(recipient.order) === Number(user.order);
  };
  // Firma takes, for each template user, the first recipient that matches it.
  const taken = new Map();
  for (const user of users) {
    const index = recipients.findIndex((r) => isMatch(r, user));
    if (index >= 0) taken.set(user.id, index);
  }
  const missing = users.filter((user) => !taken.has(user.id));
  if (missing.length) {
    const lead = nonCc.length < users.length
      ? `This template has ${users.length} signing roles but ${nonCc.length} recipient(s) were given.`
      : "Some template roles have no matching recipient.";
    throw new ConfigurationError(`${lead} Firma needs a recipient for every Signer and Approver of the template, matched by \`template_user_id\` or \`order\`. Missing: ${missing.map(describeTemplateUser).join("; ")}. Template roles: ${roles}.`);
  }
  const dropped = [];
  recipients.forEach((recipient, index) => {
    if (isCcDesignation(recipient.designation)) return;
    const user = users.find((u) => isMatch(recipient, u));
    if (!user) {
      dropped.push(`Recipient ${describeRecipient(recipient, index)} matches no Signer or Approver of the template`);
    } else if (taken.get(user.id) !== index) {
      const first = taken.get(user.id);
      dropped.push(`Recipient ${describeRecipient(recipient, index)} matches ${describeTemplateUser(user)}, already taken by recipient ${describeRecipient(recipients[first], first)}`);
    }
  });
  if (dropped.length) {
    throw new ConfigurationError(`${dropped.join("; ")}. Firma would leave these recipients out of the signing request. Match each Signer and Approver recipient to a different template role with \`template_user_id\` or \`order\`, or give extra people the designation \`CC\`. Template roles: ${roles}.`);
  }
  for (const recipient of nonCc) {
    if (!recipient.first_name || !recipient.email) {
      throw new ConfigurationError("Every recipient needs `first_name` and `email`.");
    }
  }
  return recipients;
}

/**
 * Checks the **Fields** of a template send. Each entry overrides one template field,
 * named by `template_field_id` (the field `id` from **Get Template**), `variable_name`
 * or `variable_defined_name`, and sets `value`, or `read_only_value` with
 * `read_only: true` to lock it (`read_only_value` alone does not lock the
 * field). Firma refuses an
 * override that names no field of the template.
 * @param {Array<object>} fields The parsed fields
 */
export function validateTemplateFieldOverrides(fields) {
  fields.forEach((field, index) => {
    const key = [
      "template_field_id",
      "variable_name",
      "variable_defined_name",
    ].find((k) => typeof field[k] === "string" && field[k]);
    if (!key) {
      throw new ConfigurationError(`Field ${index + 1} needs \`template_field_id\` (a field \`id\` from **Get Template**), \`variable_name\` or \`variable_defined_name\` to name the template field it sets. Template sends take field overrides only; the template places its own fields.`);
    }
  });
}

/**
 * Picks the content type Firma expects for an uploaded document: DOCX when the file
 * name or reported type says so, otherwise PDF.
 * @param {string} name The file name
 * @param {string} [contentType] The content type reported for the file
 * @returns {string}
 */
export function documentContentType(name, contentType) {
  const type = String(contentType || "").split(";")[0].trim().toLowerCase();
  if (type === DOCX_CONTENT_TYPE || /\.docx$/i.test(name || "")) {
    return DOCX_CONTENT_TYPE;
  }
  return PDF_CONTENT_TYPE;
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
