import servicem8 from "../../servicem8.app.mjs";
import { optionalBool10String } from "../../common/payload.mjs";

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
        "Parent company for this contact — pick from the dropdown (type to search by name) or paste a company UUID.",
    },
    first: {
      type: "string",
      label: "First Name",
      optional: true,
      description:
        "First name of the company contact; used to identify and address the contact",
    },
    last: {
      type: "string",
      label: "Last Name",
      optional: true,
      description: "Last name; used together with first name to identify the contact",
    },
    phone: {
      type: "string",
      label: "Phone",
      optional: true,
      description:
        "Primary phone number (include area code; international prefix allowed)",
    },
    mobile: {
      type: "string",
      label: "Mobile",
      optional: true,
      description:
        "Mobile number for SMS and voice; include area code and international prefix if needed",
    },
    email: {
      type: "string",
      label: "Email",
      optional: true,
      description:
        "Email for quotes, invoices, and other correspondence",
    },
    role: {
      type: "string",
      label: "Role",
      optional: true,
      description:
        "How this contact is used (maps to API `type`: BILLING, JOB, or Property Manager).",
      options: [
        "BILLING",
        "JOB",
        "Property Manager",
      ],
    },
    isPrimaryContact: {
      type: "boolean",
      label: "Primary Contact",
      optional: true,
      description:
        "When set, sends `\"1\"` (primary) or `\"0\"` (not primary). Only one active primary contact per company.",
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
        is_primary_contact: optionalBool10String(this.isPrimaryContact),
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
