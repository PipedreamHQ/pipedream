import servicem8 from "../../servicem8.app.mjs";

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
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createCompany({
      $,
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
