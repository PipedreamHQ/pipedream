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
  "customFields",
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
  "steps",
];

/** Step output fields returned for each process step. */
const STEP_OUTPUT_FIELDS = [
  "id",
  "name",
  "entityType",
  "dueTime",
  "completedTime",
  "assignee",
  "milestoneId",
];

export const formatStep = (step) => {
  if (step == null) {
    return step;
  }
  const out = {};
  for (const key of STEP_OUTPUT_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(step, key)) {
      out[key] = step[key];
    }
  }
  return out;
};

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
    if (!Object.prototype.hasOwnProperty.call(process, key)) {
      continue;
    }
    const value = process[key];
    if (key === "steps" && Array.isArray(value)) {
      out[key] = value.map(formatStep);
    } else {
      out[key] = value;
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

/**
 * Returns a formatted lead object for search results: id, description, status, completion,
 * value, primaryCompanyName, primaryContactName, isOverdue, lastContactDate, dueTime.
 * @param {object|null|undefined} lead - Raw lead from Nutshell API (e.g. searchLeads)
 * @returns {object|null} Lead with only search result fields
 */
export const formatSearchLeadResult = (lead) => {
  if (lead == null) {
    return lead;
  }
  return {
    id: lead.id,
    description: lead.description ?? null,
    status: lead.status ?? null,
    completion: lead.completion ?? null,
    value: lead.value ?? lead.estimatedValue ?? null,
    primaryCompanyName: lead.primaryAccountName ?? lead.primaryAccount?.name ?? null,
    primaryContactName: lead.primaryContactName ?? lead.primaryContact?.name ?? null,
    isOverdue: lead.isOverdue ?? null,
    lastContactDate: lead.lastContactDate ?? lead.lastContactedDate ?? null,
    dueTime: lead.dueTime ?? null,
  };
};
