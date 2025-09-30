import app from "../../langbase.app.mjs";

export default {
  key: "langbase-create-memory",
  name: "Create Memory",
  description: "Create a new organization memory by sending the memory data. [See the documentation](https://langbase.com/docs/api-reference/memory/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.createMemory({
      $,
      data: {
        name: this.name,
        description: this.description,
      },
    });

    $.export("$summary", `Successfully created memory ${this.name}`);

    return response;
  },
};
