import app from "../../undetectable_ai.app.mjs";

export default {
  key: "undetectable_ai-retrieve-document",
  name: "Retrieve Document",
  description: "Retrieve the document object for a submitted piece of content. [See the documentation](https://docs.undetectable.ai/#retrieve-document)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.retrieveDocument({
      $,
      data: {
        id: this.id,
      },
    });

    $.export("$summary", `Successfully retrieved document with ID '${response.id}'`);

    return response;
  },
};
