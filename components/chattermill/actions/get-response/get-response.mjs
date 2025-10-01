import chattermill from "../../chattermill.app.mjs";

export default {
  key: "chattermill-get-response",
  name: "Get Response",
  description: "Get a response by ID. [See the documentation](https://apidocs.chattermill.com/#ace8b4a6-4e39-a1d2-e443-2ed1f10cd589)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    chattermill,
    projectId: {
      propDefinition: [
        chattermill,
        "projectId",
      ],
    },
    responseId: {
      propDefinition: [
        chattermill,
        "responseId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chattermill.getResponse({
      $,
      projectId: this.projectId,
      responseId: this.responseId,
    });
    $.export("$summary", `Successfully retrieved response with ID: ${this.responseId}`);
    return response;
  },
};
