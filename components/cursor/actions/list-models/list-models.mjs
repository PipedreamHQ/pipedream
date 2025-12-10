import cursor from "../../cursor.app.mjs";

export default {
  key: "cursor-list-models",
  name: "List Models",
  description: "List all available Cursor models. [See the documentation](https://cursor.com/docs/cloud-agent/api/endpoints#list-models)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cursor,
  },
  async run({ $ }) {
    const response = await this.cursor.listModels({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.models?.length || 0} model${response.models?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
