import app from "../../fal_ai.app.mjs";

export default {
  key: "fal_ai-get-request-response",
  name: "Get Request Response",
  description: "Gets the response of a completed request in the queue. This retrieves the results of your asynchronous task. [See the documentation](https://fal.ai/docs/model-endpoints/queue#queue-endpoints).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    appId: {
      propDefinition: [
        app,
        "appId",
      ],
    },
    requestId: {
      propDefinition: [
        app,
        "requestId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      appId,
      requestId,
    } = this;

    const response = await app.getRequestResponse({
      $,
      appId,
      requestId,
    });

    $.export("$summary", "Successfully retrieved the request response.");
    return response;
  },
};
