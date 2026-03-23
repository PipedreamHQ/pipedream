import { allOptional } from "../../common/action-schema.mjs";

export const jobCreateFields = [
  {
    prop: "companyUuid",
    api: "company_uuid",
    propDefinition: "companyUuid",
  },
  {
    prop: "jobAddress",
    api: "job_address",
    type: "string",
    label: "Job Address",
    description: "Work site / job address",
  },
  {
    prop: "billingAddress",
    api: "billing_address",
    type: "string",
    label: "Billing Address",
    optional: true,
  },
  {
    prop: "status",
    api: "status",
    type: "string",
    label: "Status",
    optional: true,
  },
  {
    prop: "categoryUuid",
    api: "category_uuid",
    propDefinition: "categoryUuid",
    optional: true,
  },
  {
    prop: "purchaseOrderNumber",
    api: "purchase_order_number",
    type: "string",
    label: "Purchase Order Number",
    optional: true,
  },
  {
    prop: "companyName",
    api: "company_name",
    type: "string",
    label: "Company Name",
    optional: true,
    description: "Display name (optional; often derived from the company record)",
  },
];

export const jobUpdateFields = allOptional(jobCreateFields);
