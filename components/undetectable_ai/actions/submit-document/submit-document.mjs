import app from "../../undetectable_ai.app.mjs";

export default {
  key: "undetectable_ai-submit-document",
  name: "Submit Document",
  description: "Submit document for humanization. [See the documentation](https://docs.undetectable.ai/#submit-document)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
    readability: {
      propDefinition: [
        app,
        "readability",
      ],
    },
    purpose: {
      propDefinition: [
        app,
        "purpose",
      ],
    },
    strength: {
      propDefinition: [
        app,
        "strength",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.submitDocument({
      $,
      data: {
        content: this.content,
        readability: this.readability,
        purpose: this.purpose,
        strength: this.strength,
      },
    });

    $.export("$summary", `Successfully submited document for humanization. ID: '${response.id}'`);

    return response;
  },
};
