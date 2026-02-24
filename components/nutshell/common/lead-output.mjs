import { formatContact } from "./contact-output.mjs";

/**
 * Standard list of lead fields to include in client output.
 * Edit this array to add/remove fields returned from get-lead, create-lead, etc.
 */
export const LEAD_OUTPUT_FIELDS = [
  "id",
  "name",
  "entityType",
  "number",
  "description",
  "status",
  "createdTime",
  "modifiedTime",
  "dueTime",
  "source",
  "market",
  "tags",
  "accounts",
  "contacts",
  "assignee",
  "products",
  "processes",
  "notes",
  "estimatedValue",
];

export const LEAD_CONTACT_FIELD_NAMES = [
  "contacts",
];

const ASSIGNEE_OUTPUT_FIELDS = [
  "id",
  "name",
];

const PRODUCT_OUTPUT_FIELDS = [
  "id",
  "name",
  "price",
  "quantity",
];

const PROCESS_OUTPUT_FIELDS = [
  "id",
  "name",
  "startedTime",
  "closedTime",
  "currentMilestoneID",
  "processTemplateID",
];

export const formatAssignee = (assignee) => {
  if (assignee == null) {
    return assignee;
  }
  const out = {};
  for (const key of ASSIGNEE_OUTPUT_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(assignee, key)) {
      out[key] = assignee[key];
    }
  }
  return out;
};

export const formatProduct = (product) => {
  if (product == null) {
    return product;
  }
  const out = {};
  for (const key of PRODUCT_OUTPUT_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(product, key)) {
      out[key] = product[key];
    }
  }
  return out;
};

export const formatProcess = (process) => {
  if (process == null) {
    return process;
  }
  const out = {};
  for (const key of PROCESS_OUTPUT_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(process, key)) {
      out[key] = process[key];
    }
  }
  return out;
};

const LEAD_ASSIGNEE_FIELD_NAMES = [
  "assignee",
];

const LEAD_PRODUCT_FIELD_NAMES = [
  "products",
];

const LEAD_PROCESS_FIELD_NAMES = [
  "processes",
];

export const formatLead = (lead, contactFormatter = formatContact) => {
  if (lead == null) {
    return lead;
  }
  const out = {};
  for (const key of LEAD_OUTPUT_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(lead, key)) {
      continue;
    }
    const value = lead[key];
    if (LEAD_CONTACT_FIELD_NAMES.includes(key)) {
      if (Array.isArray(value)) {
        out[key] = value.map((item) => contactFormatter(item));
      } else if (value && typeof value === "object" && value.entityType === "Contacts") {
        out[key] = contactFormatter(value);
      } else {
        out[key] = value;
      }
    } else if (LEAD_ASSIGNEE_FIELD_NAMES.includes(key)) {
      out[key] = value && typeof value === "object"
        ? formatAssignee(value)
        : value;
    } else if (LEAD_PRODUCT_FIELD_NAMES.includes(key)) {
      out[key] = Array.isArray(value)
        ? value.map(formatProduct)
        : value;
    } else if (LEAD_PROCESS_FIELD_NAMES.includes(key)) {
      out[key] = Array.isArray(value)
        ? value.map(formatProcess)
        : value;
    } else {
      out[key] = value;
    }
  }
  return out;
};
