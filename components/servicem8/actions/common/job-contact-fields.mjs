import { allOptional } from "../../common/action-schema.mjs";

/**
 * ServiceM8 job contact create/update body fields.
 * Aligned with [Create job contacts](https://developer.servicem8.com/reference/createjobcontacts)
 * and [Update job contacts](https://developer.servicem8.com/reference/updatejobcontacts).
 */
export const jobContactCreateFields = [
  {
    prop: "jobUuid",
    api: "job_uuid",
    propDefinition: "jobUuid",
    description:
      "Job this contact belongs to; cannot be changed after the contact is created.",
  },
  {
    prop: "first",
    api: "first",
    type: "string",
    label: "First Name",
    optional: true,
    description:
      "First name; syncs with job contact fields depending on contact `type`",
  },
  {
    prop: "last",
    api: "last",
    type: "string",
    label: "Last Name",
    optional: true,
    description:
      "Last name; syncs with job contact fields depending on contact `type`",
  },
  {
    prop: "phone",
    api: "phone",
    type: "string",
    label: "Phone",
    optional: true,
    description:
      "Landline/office phone; for `JOB` syncs to job `phone_1`, for billing-style types to `phone_2`",
  },
  {
    prop: "mobile",
    api: "mobile",
    type: "string",
    label: "Mobile",
    optional: true,
    description:
      "Mobile number; for `JOB` syncs to job `mobile`, for billing-style types to `billing_mobile`",
  },
  {
    prop: "email",
    api: "email",
    type: "string",
    label: "Email",
    optional: true,
    description:
      "Email for job communications; for `JOB` syncs to job `email`, for billing-style types to `billing_email`",
  },
  {
    prop: "type",
    api: "type",
    type: "string",
    label: "Type",
    optional: true,
    description:
      "`JOB` (job contact), `BILLING` (billing contact), or `Property Manager` — controls which job fields update when this record changes",
  },
  {
    prop: "isPrimaryContact",
    api: "is_primary_contact",
    type: "string",
    label: "Is Primary Contact",
    optional: true,
    description: "Deprecated in the API; string flag if you still need to send it",
  },
];

export const jobContactUpdateFields = allOptional(jobContactCreateFields);
