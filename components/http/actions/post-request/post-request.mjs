import customRequest from "../custom-request/custom-request.mjs";

export default {
  ...customRequest,
  key: "http-post-request",
  name: "Send POST Request",
  description: "Send an HTTP POST request to any URL. Optionally configure query string parameters, headers and basic auth.",
  type: "action",
  version: "1.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...customRequest.props,
    /* eslint-disable-next-line pipedream/props-label,pipedream/props-description */
    httpRequest: {
      ...customRequest.props.httpRequest,
      default: {
        method: "POST",
      },
    },
  },
};
