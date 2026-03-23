import { allOptional } from "../../common/action-schema.mjs";
import { optionalBool01 } from "../../common/payload.mjs";

/**
 * Fields for ServiceM8 Client (`company`) create/update.
 * Aligned with [Create clients](https://developer.servicem8.com/reference/createclients)
 * and [Update clients](https://developer.servicem8.com/reference/updateclients) body params.
 */
export const companyCreateFields = [
  {
    prop: "name",
    api: "name",
    type: "string",
    label: "Name",
    description: "Company name (required by API; max 100 characters)",
  },
  {
    prop: "abnNumber",
    api: "abn_number",
    type: "string",
    label: "ABN",
    optional: true,
    description:
      "Australian Business Number: unique 11-digit identifier issued by the Australian Taxation Office. Used for tax compliance and business identity in Australia.",
  },
  {
    prop: "companyName",
    api: "company_name",
    type: "string",
    label: "Company Name (legacy field)",
    optional: true,
    description: "Maps to `company_name` if the API accepts it alongside `name`",
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
    prop: "address",
    api: "address",
    type: "string",
    label: "Address",
    optional: true,
    description: "General address (max 500 characters)",
  },
  {
    prop: "billingAddress",
    api: "billing_address",
    type: "string",
    label: "Billing Address",
    optional: true,
    description: "Billing address (max 500 characters)",
  },
  {
    prop: "postalAddress",
    api: "postal_address",
    type: "string",
    label: "Postal Address",
    optional: true,
  },
  {
    prop: "parentCompanyUuid",
    api: "parent_company_uuid",
    propDefinition: "companyUuid",
    optional: true,
    description:
      "Parent company UUID when this record is a Site; leave blank for a Head Office. Only applies when the Company Sites add-on is enabled.",
  },
  {
    prop: "website",
    api: "website",
    type: "string",
    label: "Website",
    optional: true,
  },
  {
    prop: "addressStreet",
    api: "address_street",
    type: "string",
    label: "Address Street",
    optional: true,
    description: "Street line (max 500 characters)",
  },
  {
    prop: "addressCity",
    api: "address_city",
    type: "string",
    label: "Address City",
    optional: true,
  },
  {
    prop: "addressState",
    api: "address_state",
    type: "string",
    label: "Address State",
    optional: true,
  },
  {
    prop: "addressPostcode",
    api: "address_postcode",
    type: "string",
    label: "Address Postcode",
    optional: true,
  },
  {
    prop: "addressCountry",
    api: "address_country",
    type: "string",
    label: "Address Country",
    optional: true,
  },
  {
    prop: "faxNumber",
    api: "fax_number",
    type: "string",
    label: "Fax Number",
    optional: true,
  },
  {
    prop: "badges",
    api: "badges",
    type: "string",
    label: "Badges",
    optional: true,
    description: "JSON array of badge UUIDs as a string (e.g. `[\"uuid-1\",\"uuid-2\"]`)",
  },
  {
    prop: "taxRateUuid",
    api: "tax_rate_uuid",
    type: "string",
    label: "Tax Rate UUID",
    optional: true,
  },
  {
    prop: "billingAttention",
    api: "billing_attention",
    type: "string",
    label: "Billing Attention",
    optional: true,
  },
  {
    prop: "paymentTerms",
    api: "payment_terms",
    type: "string",
    label: "Payment Terms",
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
    prop: "active",
    api: "active",
    type: "boolean",
    label: "Active",
    optional: true,
    description: "When set, sends 1 (active) or 0 (inactive) to the API",
    transform: optionalBool01,
  },
];

export const companyUpdateFields = allOptional(companyCreateFields);
