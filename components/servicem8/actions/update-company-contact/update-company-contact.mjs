import servicem8 from "../../servicem8.app.mjs";
import { YES_NO_10_OPTIONS } from "../../common/logic.mjs";

export default {
  key: "servicem8-update-company-contact",
  name: "Update Company Contact",
  description: "Update a company contact (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatecompanycontacts)",
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
          resource: "companycontact",
          prevContext,
          query,
        });
      },
      label: "Company contact to update",
      description: "Company contact record to load, merge, and save (search or paste UUID).",
    },
    companyUuid: {
      type: "string",
      label: "Company",
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
      description: "The UUID of the company this contact belongs to",
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
    type: {
      type: "string",
      label: "Type",
      optional: true,
      description:
        "Contact type (`type` in the API): BILLING, JOB, or Property Manager.",
      options: [
        "BILLING",
        "JOB",
        "Property Manager",
      ],
    },
    isPrimaryContact: {
      type: "string",
      label: "Primary Contact",
      optional: true,
      description:
        "Whether this is the primary company contact (`is_primary_contact`: `1` = yes, `0` = no). Only one active primary contact per company.",
      options: YES_NO_10_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.updateCompanyContact({
      $,
      uuid: this.uuid,
      data: {
        company_uuid: this.companyUuid,
        first: this.first,
        last: this.last,
        phone: this.phone,
        mobile: this.mobile,
        email: this.email,
        type: this.type,
        is_primary_contact: this.isPrimaryContact,
      },
    });
    $.export("$summary", `Updated Company Contact ${this.uuid}`);
    return response;
  },
};
