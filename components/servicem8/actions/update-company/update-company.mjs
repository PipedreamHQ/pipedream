import servicem8 from "../../servicem8.app.mjs";
import { optionalBool01 } from "../../common/payload.mjs";

export default {
  key: "servicem8-update-company",
  name: "Update Company",
  description: "Update a company (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updateclients)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    uuid: {
      type: "string",
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
      label: "Company to update",
      description: "Company record to load, merge, and save (search or paste UUID).",
    },
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
        "Australian Business Number (11 digits). Used for tax and business identity in Australia.",
    },
    email: {
      type: "string",
      label: "Email",
      optional: true,
      description: "Primary company email.",
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
      description: "Mobile number.",
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
      description: "Mailing address if different from billing.",
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
        "Parent company when this record is a Site (Company Sites add-on). Leave blank for a head office.",
    },
    website: {
      type: "string",
      label: "Website",
      optional: true,
      description: "Company website URL.",
    },
    badges: {
      type: "string[]",
      label: "Badges",
      optional: true,
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "badge",
          prevContext,
          query,
        });
      },
      description:
        "Badge UUIDs ([list badges](https://developer.servicem8.com/reference/listbadges)). Sent as a JSON array string.",
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
    const badgesForApi = (() => {
      const b = this.badges;
      if (b === undefined || b === null) {
        return undefined;
      }
      if (Array.isArray(b)) {
        return b.length
          ? JSON.stringify(b)
          : undefined;
      }
      if (typeof b === "string" && b.trim() !== "") {
        return b.trim();
      }
      return undefined;
    })();
    const response = await this.servicem8.updateCompany({
      $,
      uuid: this.uuid,
      data: {
        name: this.name,
        abn_number: this.abnNumber,
        email: this.email,
        phone: this.phone,
        mobile: this.mobile,
        address: this.address,
        billing_address: this.billingAddress,
        postal_address: this.postalAddress,
        parent_company_uuid: this.parentCompanyUuid,
        website: this.website,
        badges: badgesForApi,
        tax_rate_uuid: this.taxRateUuid,
        billing_attention: this.billingAttention,
        payment_terms: this.paymentTerms,
        notes: this.notes,
        active: optionalBool01(this.active),
      },
    });
    $.export("$summary", `Updated Company ${this.uuid}`);
    return response;
  },
};
