import app from "../../langbase.app.mjs";

export default {
  key: "langbase-list-memories",
  name: "List Memories",
  description: "Get a list of memory sets on Langbase. [See the documentation](https://langbase.com/docs/api-reference/memory/list)",
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
    const response = await this.app.listMemories({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.memorySets.length} memorysets`);

    return response;
  },
};
