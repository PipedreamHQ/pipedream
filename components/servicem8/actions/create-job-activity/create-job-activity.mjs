import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-create-job-activity",
  name: "Create Job Activity",
  description: "Create a new Job Activity. The new record UUID may be returned in the result field recordUuid when the API sends the x-record-uuid response header. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    record: {
      propDefinition: [
        app,
        "record",
      ],
      description:
        "JSON object of fields for the job activity request body (see ServiceM8 API). This action uses the same generic `record` pattern as other create/update actions in this component rather than separate props per field.",
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "jobactivity",
      data: this.record,
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
