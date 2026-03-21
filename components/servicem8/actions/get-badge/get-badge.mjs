import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-badge",
  name: "Get Badge",
  description: "Retrieve a Badge by UUID. [See the documentation](https://developer.servicem8.com/reference/listbadges)",
  version: "0.0.1",
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
        "badgeUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "badge",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Badge ${this.uuid}`);
    return response;
  },
};
