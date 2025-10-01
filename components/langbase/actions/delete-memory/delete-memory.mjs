import app from "../../langbase.app.mjs";

export default {
  key: "langbase-delete-memory",
  name: "Delete Memory",
  description: "Delete an existing memory on Langbase. [See the documentation](https://langbase.com/docs/api-reference/memory/delete)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    memoryName: {
      propDefinition: [
        app,
        "memoryName",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.deleteMemory({
      $,
      memoryName: this.memoryName,
    });

    $.export("$summary", `Successfully deleted memory named ${this.memoryName}`);

    return response;
  },
};
