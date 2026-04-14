import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-update-job-contact",
  name: "Update Job Contact",
  description: "Update a job contact (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatejobcontacts)",
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
          resource: "jobcontact",
          prevContext,
          query,
        });
      },
      label: "Job contact to update",
      description: "Job contact record to load, merge, and save (search or paste UUID).",
    },
    first: {
      type: "string",
      label: "First Name",
      optional: true,
      description: "First name.",
    },
    last: {
      type: "string",
      label: "Last Name",
      optional: true,
      description: "Last name.",
    },
    phone: {
      type: "string",
      label: "Phone",
      optional: true,
      description: "Landline/office phone.",
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
      description: "Email for job communications.",
    },
    type: {
      type: "string",
      label: "Type",
      optional: true,
      description:
        "Controls which job fields sync when this contact changes ([API](https://developer.servicem8.com/reference/updatejobcontacts)).",
      options: [
        "JOB",
        "BILLING",
        "Property Manager",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.updateJobContact({
      $,
      uuid: this.uuid,
      data: {
        first: this.first,
        last: this.last,
        phone: this.phone,
        mobile: this.mobile,
        email: this.email,
        type: this.type,
      },
    });
    $.export("$summary", `Updated Job Contact ${this.uuid}`);
    return response;
  },
};
