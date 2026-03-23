import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-queue",
  name: "Delete Queue",
  description: "Delete a job queue by UUID. [See the documentation](https://developer.servicem8.com/reference/deletejobqueues)",
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
        "queueUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.deleteResource({
      $,
      resource: "queue",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Queue ${this.uuid}`);
    return response;
  },
};
