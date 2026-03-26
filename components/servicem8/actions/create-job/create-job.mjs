import servicem8 from "../../servicem8.app.mjs";

const JOB_STATUS_OPTIONS = [
  "Quote",
  "Work Order",
  "Unsuccessful",
  "Completed",
];

export default {
  key: "servicem8-create-job",
  name: "Create Job",
  description: "Create a job. [See the documentation](https://developer.servicem8.com/reference/createjobs)",
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
      description:
        "Client/company for this job (billing and contact relationship).",
    },
    jobAddress: {
      type: "string",
      label: "Job Address",
      description: "Work site address (max 500 characters).",
    },
    billingAddress: {
      type: "string",
      label: "Billing Address",
      optional: true,
      description: "Invoice address; defaults to job address if omitted (max 500).",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Initial job status (max 20 characters).",
      options: JOB_STATUS_OPTIONS,
    },
    createdByStaffUuid: {
      type: "string",
      label: "Created by staff",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "staff",
          prevContext,
          query,
        });
      },
      optional: true,
      description: "Staff member who created the job.",
    },
    categoryUuid: {
      type: "string",
      label: "Category",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "category",
          prevContext,
          query,
        });
      },
      optional: true,
      description: "Job category (type of work / department).",
    },
    purchaseOrderNumber: {
      type: "string",
      label: "Purchase Order Number",
      optional: true,
      description: "Client PO reference (max 100 characters).",
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
    jobDescription: {
      type: "string",
      label: "Job Description",
      optional: true,
      description: "Scope or work requested.",
    },
    note: {
      type: "string",
      label: "Note",
      optional: true,
      description:
        "Optional diary note (creates a Note linked to the new job after create).",
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
    const {
      body, recordUuid,
    } = await this.servicem8.createJob({
      $,
      data: {
        company_uuid: this.companyUuid,
        job_address: this.jobAddress,
        billing_address: this.billingAddress,
        status: this.status,
        created_by_staff_uuid: this.createdByStaffUuid,
        category_uuid: this.categoryUuid,
        purchase_order_number: this.purchaseOrderNumber,
        badges: badgesForApi,
        job_description: this.jobDescription,
      },
    });
    let noteRecordUuid;
    if (
      recordUuid &&
      this.note != null &&
      String(this.note).trim() !== ""
    ) {
      const noteRes = await this.servicem8.createNote({
        $,
        data: {
          related_object: "job",
          related_object_uuid: recordUuid,
          note: String(this.note).trim(),
        },
      });
      noteRecordUuid = noteRes.recordUuid;
    }
    $.export(
      "$summary",
      `Created Job${recordUuid
        ? ` (${recordUuid})`
        : ""}${noteRecordUuid
        ? `; diary note (${noteRecordUuid})`
        : ""}`,
    );
    return {
      body,
      recordUuid,
      ...(noteRecordUuid && {
        noteRecordUuid,
      }),
    };
  },
};
