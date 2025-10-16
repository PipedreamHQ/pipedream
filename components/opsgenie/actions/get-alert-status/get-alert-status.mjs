import app from "../../opsgenie.app.mjs";

export default {
  key: "opsgenie-get-alert-status",
  name: "Get Alert Status",
  description: "Get the status of the alert with the specified ID. [See the documentation](https://www.postman.com/api-evangelist/opsgenie/request/03tcghu/get-request-status-of-alert)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    requestId: {
      propDefinition: [
        app,
        "requestId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getAlertStatus({
      $,
      requestId: this.requestId,
    });

    $.export("$summary", `Request processing status: '${response.data.status}'`);

    return response;
  },
};
