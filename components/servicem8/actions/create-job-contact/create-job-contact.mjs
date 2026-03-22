import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-create-job-contact",
  name: "Create Job Contact",
  description: "Create a new Job Contact. The new record UUID may be returned in the result field recordUuid when the API sends the x-record-uuid response header. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
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
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "jobcontact",
      data: this.record,
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
