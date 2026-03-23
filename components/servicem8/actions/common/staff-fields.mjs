import { optionalBool01 } from "../../common/payload.mjs";

export const staffUpdateFields = [
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
    transform: optionalBool01,
  },
];
