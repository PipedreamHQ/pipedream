import openai from "../../openai.app.mjs";

export default {
  key: "openai-list-vector-stores",
  name: "List Vector Stores",
  description: "Returns a list of vector stores. [See the documentation](https://platform.openai.com/docs/api-reference/vector-stores/list)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    openai,
    limit: {
      propDefinition: [
        openai,
        "limit",
      ],
    },
    order: {
      propDefinition: [
        openai,
        "order",
      ],
    },
  },
  async run({ $ }) {
    const response = this.openai.paginate({
      resourceFn: this.openai.listVectorStores,
      args: {
        $,
        params: {
          order: this.order,
        },
      },
      max: this.limit,
    });

    const vectorStores = [];
    for await (const vectorStore of response) {
      vectorStores.push(vectorStore);
    }

    $.export("$summary", `Successfully retrieved ${vectorStores.length} vector store${vectorStores.length === 1
      ? ""
      : "s"}`);
    return vectorStores;
  },
};
