import { allOptional } from "../../common/action-schema.mjs";

export const companyCreateFields = [
  {
    prop: "name",
    api: "name",
    type: "string",
    label: "Name",
    description: "Client / company name",
  },
  {
    prop: "companyName",
    api: "company_name",
    type: "string",
    label: "Company Name",
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
    prop: "billingAddress",
    api: "billing_address",
    type: "string",
    label: "Billing Address",
    optional: true,
  },
  {
    prop: "postalAddress",
    api: "postal_address",
    type: "string",
    label: "Postal Address",
    optional: true,
  },
  {
    prop: "website",
    api: "website",
    type: "string",
    label: "Website",
    optional: true,
  },
  {
    prop: "notes",
    api: "notes",
    type: "string",
    label: "Notes",
    optional: true,
  },
];

export const companyUpdateFields = allOptional(companyCreateFields);
