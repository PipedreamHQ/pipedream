import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-create-company-contact",
  name: "Create Company Contact",
  description: "Create a company contact. [See the documentation](https://developer.servicem8.com/reference/createcompanycontacts)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    companyUuid: {
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
      label: "Company",
      description:
        "Parent company — pick from the dropdown or paste a company UUID.",
    },
    first: {
      type: "string",
      label: "First Name",
      optional: true,
      description: "First name of the contact.",
    },
    last: {
      type: "string",
      label: "Last Name",
      optional: true,
      description: "Last name of the contact.",
    },
    phone: {
      type: "string",
      label: "Phone",
      optional: true,
      description: "Primary phone (include area code; international prefix allowed)",
    },
    mobile: {
      type: "string",
      label: "Mobile",
      optional: true,
      description: "Mobile number.",
    },
    email: {
      type: "string",
      label: "Email",
      optional: true,
      description: "Email for quotes, invoices, and correspondence.",
    },
    role: {
      type: "string",
      label: "Role",
      description:
        "Maps to API `type`: BILLING, JOB, or Property Manager (required for create).",
      options: [
        "BILLING",
        "JOB",
        "Property Manager",
      ],
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createCompanyContact({
      $,
      data: {
        company_uuid: this.companyUuid,
        first: this.first,
        last: this.last,
        phone: this.phone,
        mobile: this.mobile,
        email: this.email,
        type: this.role,
      },
    });
    $.export("$summary", `Created Company Contact${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
