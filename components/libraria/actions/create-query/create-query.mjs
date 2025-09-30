import app from "../../libraria.app.mjs";

export default {
  name: "Create Query",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "libraria-create-query",
  description: "Creates a query. [See the documentation](https://docs.libraria.dev/api-reference/library/create-query)",
  type: "action",
  props: {
    app,
    libraryId: {
      propDefinition: [
        app,
        "libraryId",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "The message that will be sent to assistant",
    },
  },
  async run({ $ }) {
    const response = await this.app.createQuery({
      $,
      libraryId: this.libraryId,
      data: {
        query: this.query,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created query with conversation ID \`${response.conversationId}\``);
    }

    return response;
  },
};
