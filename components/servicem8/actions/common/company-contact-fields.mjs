import { optionalBool01 } from "../../common/payload.mjs";
import { allOptional } from "../../common/action-schema.mjs";

export const companyContactCreateFields = [
  {
    prop: "companyUuid",
    api: "company_uuid",
    propDefinition: "companyUuid",
  },
  {
    prop: "first",
    api: "first",
    type: "string",
    label: "First Name",
    optional: true,
  },
  {
    prop: "last",
    api: "last",
    type: "string",
    label: "Last Name",
    optional: true,
  },
  {
    prop: "email",
    api: "email",
    type: "string",
    label: "Email",
    optional: true,
  },
  {
    prop: "phone",
    api: "phone",
    type: "string",
    label: "Phone",
    optional: true,
  },
  {
    prop: "mobile",
    api: "mobile",
    type: "string",
    label: "Mobile",
    optional: true,
  },
  {
    prop: "fax",
    api: "fax",
    type: "string",
    label: "Fax",
    optional: true,
  },
  {
    prop: "notes",
    api: "notes",
    type: "string",
    label: "Notes",
    optional: true,
  },
  {
    prop: "jobTitle",
    api: "job_title",
    type: "string",
    label: "Job Title",
    optional: true,
  },
  {
    prop: "active",
    api: "active",
    type: "boolean",
    label: "Active",
    optional: true,
    description: "When set, sends 1 or 0 to the API",
    transform: optionalBool01,
  },
];

export const companyContactUpdateFields = allOptional(companyContactCreateFields);
