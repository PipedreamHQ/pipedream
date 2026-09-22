import customRequest from "../custom-request/custom-request.mjs";

export default {
  ...customRequest,
  key: "http-put-request",
  name: "Send PUT Request",
  description: "Send an HTTP PUT request to any URL. Optionally configure query string parameters, headers and basic auth.",
  type: "action",
  version: "1.1.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...customRequest.props,
    /* eslint-disable-next-line pipedream/props-label,pipedream/props-description */
    httpRequest: {
      ...customRequest.props.httpRequest,
      default: {
        method: "PUT",
      },
    },
  },
};
