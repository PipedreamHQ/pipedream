import devin from "../../devin.app.mjs";

export default {
  key: "devin-list-knowledge",
  name: "List Knowledge",
  description: "Retrieve a list of all knowledge objects. [See the documentation](https://docs.devin.ai/api-reference/knowledge/list-knowledge)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    devin,
  },
  async run({ $ }) {
    const response = await this.devin.listKnowledge({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.knowledge?.length || 0} knowledge objects`);
    return response;
  },
};
