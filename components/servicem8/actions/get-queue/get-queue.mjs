import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-queue",
  name: "Get Queue",
  description: "Retrieve a Queue by UUID. [See the documentation](https://developer.servicem8.com/reference/listqueues)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.servicem8.getResource({
      $,
      resource: "queue",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Queue ${this.uuid}`);
    return response;
  },
};
