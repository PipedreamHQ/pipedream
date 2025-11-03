import app from "../../vext.app.mjs";

export default {
  key: "vext-send-query",
  name: "Send Query",
  description: "Send a query request to your LLM pipeline. [See the documentation](https://vext.readme.io/reference/http-request-query)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    payload: {
      propDefinition: [
        app,
        "payload",
      ],
    },
    longPolling: {
      propDefinition: [
        app,
        "longPolling",
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
    const response = await this.app.sendQuery({
      $,
      data: {
        payload: this.payload,
        long_polling: this.longPolling,
        request_id: this.requestId,
      },
    });

    $.export("$summary", `Query with ID '${response.request_id || response.text.request_id}' successfully sent`);

    return response;
  },
};
