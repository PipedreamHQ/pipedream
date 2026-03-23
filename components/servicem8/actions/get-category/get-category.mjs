import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-category",
  name: "Get Category",
  description: "Get a category by UUID. [See the documentation](https://developer.servicem8.com/reference/getcategories)",
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
        "categoryUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "category",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Category ${this.uuid}`);
    return response;
  },
};
