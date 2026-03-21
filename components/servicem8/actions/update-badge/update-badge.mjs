import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-update-badge",
  name: "Update Badge",
  description: "Update an existing Badge. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
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
        "badgeUuid",
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
      resource: "badge",
      uuid: this.uuid,
      data: this.record,
    });
    $.export("$summary", `Updated Badge ${this.uuid}`);
    return response;
  },
};
