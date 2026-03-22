import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-staff",
  name: "Get Staff",
  description: "Retrieve Staff by UUID. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
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
        "staffUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "staff",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Staff ${this.uuid}`);
    return response;
  },
};
