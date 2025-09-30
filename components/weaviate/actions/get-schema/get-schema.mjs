import app from "../../weaviate.app.mjs";

export default {
  key: "weaviate-get-schema",
  name: "Get Schema",
  description: "Get schema from Weaviate. [See the documentation](https://docs.weaviate.io/weaviate/api/rest#tag/schema/get/schema)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getSchema({
      $,
    });
    $.export("$summary", "Successfully retrieved the current database schema");
    return response;
  },
};
