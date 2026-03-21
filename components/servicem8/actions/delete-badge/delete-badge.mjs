import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-badge",
  name: "Delete Badge",
  description: "Delete a Badge by UUID. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
  version: "0.0.2",
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
        "badgeUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.deleteResource({
      $,
      resource: "badge",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Badge ${this.uuid}`);
    return response;
  },
};
