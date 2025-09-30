import helperFunctions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-send-http-request",
  name: "Send Webhook",
  description: "Send Webhook and Payload",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helperFunctions,
    /* eslint-disable-next-line pipedream/props-description */
    httpRequest: {
      type: "http_request",
      label: "HTTP Request Configuration",
      default: {
        method: "POST",
      },
    },
  },
  async run() {
    return await this.httpRequest.execute();
  },
};
