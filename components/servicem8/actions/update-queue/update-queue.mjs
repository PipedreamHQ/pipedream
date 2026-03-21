import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-update-queue",
  name: "Update Queue",
  description: "Update an existing Queue. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
  version: "0.0.1",
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
        "queueUuid",
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
      resource: "queue",
      uuid: this.uuid,
      data: this.record,
    });
    $.export("$summary", `Updated Queue ${this.uuid}`);
    return response;
  },
};
