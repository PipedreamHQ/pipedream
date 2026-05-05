import servicem8 from "../../servicem8.app.mjs";
import { badgesJsonArrayForApi } from "../../common/payload.mjs";

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
        "Australian Business Number (11 digits). Used for tax and business identity in Australia.",
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
    addressStreet: {
      type: "string",
      label: "Address — street",
      optional: true,
      description: "Street line (max 500 characters).",
    },
    addressCity: {
      type: "string",
      label: "Address — city",
      optional: true,
      description: "City / locality.",
    },
    addressState: {
      type: "string",
      label: "Address — state",
      optional: true,
      description: "State or region.",
    },
    addressPostcode: {
      type: "string",
      label: "Address — postcode",
      optional: true,
      description: "Postal or ZIP code.",
    },
    addressCountry: {
      type: "string",
      label: "Address — country",
      optional: true,
      description: "Country.",
    },
    faxNumber: {
      type: "string",
      label: "Fax number",
      optional: true,
      description: "Fax number.",
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
        "Badge UUIDs ([list badges](https://developer.servicem8.com/reference/listbadges)). Sent as a JSON array string for the API.",
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
      description: "UUID of the tax rate applied to this company’s invoices and quotes.",
    },
    billingAttention: {
      propDefinition: [
        servicem8,
        "billingAttention",
      ],
    },
    paymentTerms: {
      propDefinition: [
        servicem8,
        "paymentTerms",
      ],
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
        address: this.address,
        billing_address: this.billingAddress,
        parent_company_uuid: this.parentCompanyUuid,
        website: this.website,
        address_street: this.addressStreet,
        address_city: this.addressCity,
        address_state: this.addressState,
        address_postcode: this.addressPostcode,
        address_country: this.addressCountry,
        fax_number: this.faxNumber,
        badges: badgesJsonArrayForApi(this.badges),
        tax_rate_uuid: this.taxRateUuid,
        billing_attention: this.billingAttention,
        payment_terms: this.paymentTerms,
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
