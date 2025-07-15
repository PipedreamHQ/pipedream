import chattermill from "../../chattermill.app.mjs";

export default {
  key: "chattermill-update-response",
  name: "Update Response",
  description: "Update a response by ID. [See the documentation](https://apidocs.chattermill.com/#a632c60d-ccda-74b3-b9e7-b5a0c4917e1a)",
  version: "0.0.{{ts}}",
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
    const response = await this.chattermill.updateResponse({
      $,
      projectId: this.projectId,
      responseId: this.responseId,
      data: {},
    });
    $.export("$summary", `Successfully updated response with ID: ${this.responseId}`);
    return response;
  },
};
