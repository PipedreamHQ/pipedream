import { optionalBool01 } from "../../common/payload.mjs";
import { allOptional } from "../../common/action-schema.mjs";

export const jobContactCreateFields = [
  {
    prop: "jobUuid",
    api: "job_uuid",
    propDefinition: "jobUuid",
  },
  {
    prop: "companycontactUuid",
    api: "company_contact_uuid",
    propDefinition: "companycontactUuid",
    optional: true,
    description: "Existing company contact to link (optional if using inline name fields)",
  },
  {
    prop: "contactFirst",
    api: "contact_first",
    type: "string",
    label: "Contact First Name",
    optional: true,
  },
  {
    prop: "contactLast",
    api: "contact_last",
    type: "string",
    label: "Contact Last Name",
    optional: true,
  },
  {
    prop: "billingContactFirst",
    api: "billing_contact_first",
    type: "string",
    label: "Billing Contact First Name",
    optional: true,
  },
  {
    prop: "billingContactLast",
    api: "billing_contact_last",
    type: "string",
    label: "Billing Contact Last Name",
    optional: true,
  },
  {
    prop: "isPrimaryContact",
    api: "is_primary_contact",
    type: "boolean",
    label: "Primary Contact",
    optional: true,
    transform: optionalBool01,
  },
];

export const jobContactUpdateFields = allOptional(jobContactCreateFields);
