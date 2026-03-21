import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-create-job-material",
  name: "Create Job Material",
  description: "Create a new Job Material. The new record UUID is returned in the result field recordUuid (HTTP header x-record-uuid). [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
  version: "0.0.1",
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
      resource: "jobmaterial",
      data: this.record,
    });
    $.export("$summary", `Created Job Material${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
