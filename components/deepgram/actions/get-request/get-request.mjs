import deepgram from "../../deepgram.app.mjs";

export default {
  key: "deepgram-get-request",
  name: "Get Request",
  description: "Retrieves the details of the specified request sent to the Deepgram API for the specified project. [See the documentation](https://developers.deepgram.com/api-reference/usage/#get-request)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    deepgram,
    projectId: {
      propDefinition: [
        deepgram,
        "projectId",
      ],
    },
    requestId: {
      propDefinition: [
        deepgram,
        "requestId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const request = await this.deepgram.getRequest({
      projectId: this.projectId,
      requestId: this.requestId,
      $,
    });

    if (request) {
      $.export("$summary", `Successfully retrieved request with ID ${this.requestId}`);
    }

    return request;
  },
};
