import { formatContact } from "./contact-output.mjs";

/**
 * Standard list of company (account) fields to include in client output.
 * Edit this array to add/remove fields returned from get-company, create-company, etc.
 */
export const COMPANY_OUTPUT_FIELDS = [
  "id",
  "name",
  "entityType",
  "industry",
  "accountType",
  "territory",
  "location",
  "url",
  "emails",
  "phones",
  "address",
  "createdTime",
  "modifiedTime",
  "contacts",
  "customFields",
];

/**
 * Company field names that contain contact data. These will be run through formatContact.
 */
export const COMPANY_CONTACT_FIELD_NAMES = [
  "contacts",
];

/**
 * Returns a company object with only the standard output fields.
 * Nested contact data (e.g. contacts array) is also formatted via formatContact.
 * Use wherever a company is returned to clients (get-company, create-company, etc.).
 * @param {object|null|undefined} company - Raw company (account) from Nutshell API
 * @param {function} contactFormatter - Optional; defaults to formatContact
 * @returns {object|null} Company with only COMPANY_OUTPUT_FIELDS and formatted contacts
 */
export const formatCompany = (company, contactFormatter = formatContact) => {
  if (company == null) {
    return company;
  }
  const out = {};
  for (const key of COMPANY_OUTPUT_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(company, key)) {
      continue;
    }
    const value = company[key];
    if (COMPANY_CONTACT_FIELD_NAMES.includes(key)) {
      if (Array.isArray(value)) {
        out[key] = value.map((item) => contactFormatter(item));
      } else if (value && typeof value === "object" && value.entityType === "Contacts") {
        out[key] = contactFormatter(value);
      } else {
        out[key] = value;
      }
    } else {
      out[key] = value;
    }
  }
  return out;
};
