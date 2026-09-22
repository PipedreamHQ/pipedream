import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-create-job-activity",
  name: "Create Job Activity",
  description: "Create a job activity. [See the documentation](https://developer.servicem8.com/reference/createjobactivities)",
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
      description: "Job this activity belongs to.",
    },
    staffUuid: {
      type: "string",
      label: "Staff",
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
      description: "Assigned staff member (`staff_uuid`).",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      optional: true,
      description: "Scheduled start (`YYYY-MM-DD HH:MM:SS` or as accepted by the API).",
    },
    endDate: {
      type: "string",
      label: "End Date",
      optional: true,
      description: "Scheduled end (`YYYY-MM-DD HH:MM:SS` or as accepted by the API).",
    },
    materialUuid: {
      type: "string",
      label: "Job material",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "jobmaterial",
          prevContext,
          query,
        });
      },
      optional: true,
      description: "Optional job material line for costing.",
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createJobActivity({
      $,
      data: {
        job_uuid: this.jobUuid,
        staff_uuid: this.staffUuid,
        start_date: this.startDate,
        end_date: this.endDate,
        material_uuid: this.materialUuid,
      },
    });
    $.export("$summary", `Created Job Activity${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
