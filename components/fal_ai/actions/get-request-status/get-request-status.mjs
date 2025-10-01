import app from "../../fal_ai.app.mjs";

export default {
  key: "fal_ai-get-request-status",
  name: "Get Request Status",
  description: "Gets the status of a request in the queue. This allows you to monitor the progress of your asynchronous tasks. [See the documentation](https://fal.ai/docs/model-endpoints/queue#queue-endpoints).",
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
    logs: {
      propDefinition: [
        app,
        "logs",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      appId,
      requestId,
      logs,
    } = this;

    const response = await app.getRequestStatus({
      $,
      appId,
      requestId,
      params: {
        logs: logs
          ? 1
          : undefined,
      },
    });

    $.export("$summary", `Successfully retrieved status as \`${response.status}\`.`);

    return response;
  },
};
