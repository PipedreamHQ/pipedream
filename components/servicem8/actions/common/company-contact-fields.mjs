import { optionalBool10String } from "../../common/payload.mjs";
import { allOptional } from "../../common/action-schema.mjs";

/**
 * Fields for ServiceM8 company contacts.
 * Aligned with [Create company contacts](https://developer.servicem8.com/reference/createcompanycontacts)
 * and [Update company contacts](https://developer.servicem8.com/reference/updatecompanycontacts) body params.
 */
export const companyContactCreateFields = [
  {
    prop: "companyUuid",
    api: "company_uuid",
    propDefinition: "companyUuid",
    description: "The UUID of the company this contact belongs to",
  },
  {
    prop: "first",
    api: "first",
    type: "string",
    label: "First Name",
    optional: true,
    description:
      "First name of the company contact; used to identify and address the contact",
  },
  {
    prop: "last",
    api: "last",
    type: "string",
    label: "Last Name",
    optional: true,
    description: "Last name; used together with first name to identify the contact",
  },
  {
    prop: "phone",
    api: "phone",
    type: "string",
    label: "Phone",
    optional: true,
    description:
      "Primary phone number (include area code; international prefix allowed)",
  },
  {
    prop: "mobile",
    api: "mobile",
    type: "string",
    label: "Mobile",
    optional: true,
    description:
      "Mobile number for SMS and voice; include area code and international prefix if needed",
  },
  {
    prop: "email",
    api: "email",
    type: "string",
    label: "Email",
    optional: true,
    description:
      "Email for quotes, invoices, and other correspondence",
  },
  {
    prop: "type",
    api: "type",
    type: "string",
    label: "Type",
    optional: true,
    description:
      "Contact role, e.g. `BILLING` or `JOB` (determines how the contact is used)",
  },
  {
    prop: "isPrimaryContact",
    api: "is_primary_contact",
    type: "boolean",
    label: "Primary Contact",
    optional: true,
    description:
      "When set, sends `\"1\"` (primary) or `\"0\"` (not primary). Only one active primary contact per company.",
    transform: optionalBool10String,
  },
];

export const companyContactUpdateFields = allOptional(companyContactCreateFields);
