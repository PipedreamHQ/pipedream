import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-create-job-contact",
  name: "Create Job Contact",
  description: "Create a job contact. [See the documentation](https://developer.servicem8.com/reference/createjobcontacts)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    jobUuid: {
      type: "string",
      label: "Job",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "job",
          prevContext,
          query,
        });
      },
      description: "Job this contact belongs to (cannot be changed after create).",
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
      description:
        "Controls field sync when this contact changes ([docs](https://developer.servicem8.com/reference/createjobcontacts)).",
      options: [
        "JOB",
        "BILLING",
        "Property Manager",
      ],
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createJobContact({
      $,
      data: {
        job_uuid: this.jobUuid,
        first: this.first,
        last: this.last,
        phone: this.phone,
        mobile: this.mobile,
        email: this.email,
        type: this.type,
      },
    });
    $.export("$summary", `Created Job Contact${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
