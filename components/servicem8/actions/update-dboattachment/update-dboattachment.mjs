import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-update-dboattachment",
  name: "Update Attachment",
  description: "Update an existing attachment record. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    uuid: {
      propDefinition: [
        app,
        "dboattachmentUuid",
      ],
    },
    record: {
      propDefinition: [
        app,
        "record",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.updateResource({
      $,
      resource: "dboattachment",
      uuid: this.uuid,
      data: this.record,
    });
    $.export("$summary", `Updated attachment ${this.uuid}`);
    return response;
  },
};
