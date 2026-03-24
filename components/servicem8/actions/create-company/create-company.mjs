import servicem8 from "../../servicem8.app.mjs";
import { optionalBool01 } from "../../common/payload.mjs";

export default {
  key: "servicem8-create-company",
  name: "Create Company",
  description: "Create a company (client). [See the documentation](https://developer.servicem8.com/reference/createclients)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    name: {
      type: "string",
      label: "Name",
      description: "Company name (required by API; max 100 characters)",
    },
    abnNumber: {
      type: "string",
      label: "ABN",
      optional: true,
      description:
        "Australian Business Number: unique 11-digit identifier issued by the Australian Taxation Office. Used for tax compliance and business identity in Australia.",
    },
    companyName: {
      type: "string",
      label: "Company Name (legacy field)",
      optional: true,
      description: "Maps to `company_name` if the API accepts it alongside `name`",
    },
    email: {
      type: "string",
      label: "Email",
      optional: true,
      description: "Primary company email for correspondence.",
    },
    phone: {
      type: "string",
      label: "Phone",
      optional: true,
      description: "Main landline or office phone.",
    },
    mobile: {
      type: "string",
      label: "Mobile",
      optional: true,
      description: "Mobile number for SMS or contact.",
    },
    address: {
      type: "string",
      label: "Address",
      optional: true,
      description: "General address (max 500 characters)",
    },
    billingAddress: {
      type: "string",
      label: "Billing Address",
      optional: true,
      description: "Billing address (max 500 characters)",
    },
    postalAddress: {
      type: "string",
      label: "Postal Address",
      optional: true,
      description: "Mailing or postal address if different from billing.",
    },
    parentCompanyUuid: {
      type: "string",
      label: "Parent company",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "company",
          prevContext,
          query,
        });
      },
      optional: true,
      description:
        "Parent company UUID when this record is a Site; leave blank for a Head Office. Only applies when the Company Sites add-on is enabled.",
    },
    website: {
      type: "string",
      label: "Website",
      optional: true,
      description: "Company website URL.",
    },
    addressStreet: {
      type: "string",
      label: "Address Street",
      optional: true,
      description: "Street line (max 500 characters)",
    },
    addressCity: {
      type: "string",
      label: "Address City",
      optional: true,
      description: "City for structured address fields.",
    },
    addressState: {
      type: "string",
      label: "Address State",
      optional: true,
      description: "State or region.",
    },
    addressPostcode: {
      type: "string",
      label: "Address Postcode",
      optional: true,
      description: "Postal or ZIP code.",
    },
    addressCountry: {
      type: "string",
      label: "Address Country",
      optional: true,
      description: "Country name or code.",
    },
    faxNumber: {
      type: "string",
      label: "Fax Number",
      optional: true,
      description: "Fax number if used.",
    },
    badges: {
      type: "string",
      label: "Badges",
      optional: true,
      description: "JSON array of badge UUIDs as a string (e.g. `[\"uuid-1\",\"uuid-2\"]`)",
    },
    taxRateUuid: {
      type: "string",
      label: "Tax rate",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "taxrate",
          prevContext,
          query,
        });
      },
      optional: true,
      description: "Tax rate applied to this company’s invoices and quotes.",
    },
    billingAttention: {
      type: "string",
      label: "Billing Attention",
      optional: true,
      description: "Who invoices should be addressed to.",
      options: [
        "Accounts",
        "Accounts Payable",
        "Managing Director",
        "Office Manager",
        "Primary Contact",
      ],
    },
    paymentTerms: {
      type: "string",
      label: "Payment Terms",
      optional: true,
      description: "When payment is due.",
      options: [
        "Due on receipt",
        "7 days",
        "14 days",
        "21 days",
        "30 days",
        "60 days",
        "90 days",
        "End of month",
        "COD",
      ],
    },
    notes: {
      type: "string",
      label: "Notes",
      optional: true,
      description: "Free-text notes stored on the company record.",
    },
    active: {
      type: "boolean",
      label: "Active",
      optional: true,
      description: "When set, sends 1 (active) or 0 (inactive) to the API",
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createCompany({
      $,
      data: {
        name: this.name,
        abn_number: this.abnNumber,
        company_name: this.companyName,
        email: this.email,
        phone: this.phone,
        mobile: this.mobile,
        address: this.address,
        billing_address: this.billingAddress,
        postal_address: this.postalAddress,
        parent_company_uuid: this.parentCompanyUuid,
        website: this.website,
        address_street: this.addressStreet,
        address_city: this.addressCity,
        address_state: this.addressState,
        address_postcode: this.addressPostcode,
        address_country: this.addressCountry,
        fax_number: this.faxNumber,
        badges: this.badges,
        tax_rate_uuid: this.taxRateUuid,
        billing_attention: this.billingAttention,
        payment_terms: this.paymentTerms,
        notes: this.notes,
        active: optionalBool01(this.active),
      },
    });
    $.export("$summary", `Created Company${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
