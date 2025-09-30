import app from "../../fal_ai.app.mjs";

export default {
  key: "fal_ai-cancel-request",
  name: "Cancel Request",
  description: "Cancels a request in the queue. This allows you to stop a long-running task if it's no longer needed. [See the documentation](https://fal.ai/docs/model-endpoints/queue#queue-endpoints).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
  methods: {
    cancelRequest({
      appId, requestId, ...args
    } = {}) {
      return this.app.put({
        path: `/${appId}/requests/${requestId}/cancel`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      cancelRequest,
      appId,
      requestId,
    } = this;

    const response = await cancelRequest({
      $,
      appId,
      requestId,
    });

    $.export("$summary", "Successfully canceled request.");
    return response;
  },
};
