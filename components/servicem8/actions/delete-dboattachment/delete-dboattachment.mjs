import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-dboattachment",
  name: "Delete Attachment",
  description: "Delete a Attachment by UUID. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
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
  },
  async run({ $ }) {
    const response = await this.servicem8.deleteResource({
      $,
      resource: "dboattachment",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Attachment ${this.uuid}`);
    return response;
  },
};
