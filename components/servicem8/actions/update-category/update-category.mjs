import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-update-category",
  name: "Update Category",
  description: "Update an existing Category. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
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
        "categoryUuid",
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
      resource: "category",
      uuid: this.uuid,
      data: this.record,
    });
    $.export("$summary", `Updated Category ${this.uuid}`);
    return response;
  },
};
