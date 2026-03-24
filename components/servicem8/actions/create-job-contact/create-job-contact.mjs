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
      description:
        "Job this contact belongs to; cannot be changed after the contact is created.",
    },
    first: {
      type: "string",
      label: "First Name",
      optional: true,
      description:
        "First name; syncs with job contact fields depending on contact `type`",
    },
    last: {
      type: "string",
      label: "Last Name",
      optional: true,
      description:
        "Last name; syncs with job contact fields depending on contact `type`",
    },
    phone: {
      type: "string",
      label: "Phone",
      optional: true,
      description:
        "Landline/office phone; for `JOB` syncs to job `phone_1`, for billing-style types to `phone_2`",
    },
    mobile: {
      type: "string",
      label: "Mobile",
      optional: true,
      description:
        "Mobile number; for `JOB` syncs to job `mobile`, for billing-style types to `billing_mobile`",
    },
    email: {
      type: "string",
      label: "Email",
      optional: true,
      description:
        "Email for job communications; for `JOB` syncs to job `email`, for billing-style types to `billing_email`",
    },
    type: {
      type: "string",
      label: "Type",
      optional: true,
      description:
        "Controls which job fields sync when this contact changes ([API](https://developer.servicem8.com/reference/createjobcontacts)).",
      options: [
        "JOB",
        "BILLING",
        "Property Manager",
      ],
    },
    isPrimaryContact: {
      type: "string",
      label: "Is Primary Contact",
      optional: true,
      description: "Deprecated in the API; string flag if you still need to send it",
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
        is_primary_contact: this.isPrimaryContact,
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
