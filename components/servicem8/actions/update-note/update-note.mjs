import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-update-note",
  name: "Update Note",
  description: "Update an existing Note. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
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
        "noteUuid",
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
      resource: "note",
      uuid: this.uuid,
      data: this.record,
    });
    $.export("$summary", `Updated Note ${this.uuid}`);
    return response;
  },
};
