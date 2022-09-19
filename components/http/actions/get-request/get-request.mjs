import customRequest from "../custom-request/custom-request.mjs";

export default {
  ...customRequest,
  key: "http-get-request",
  name: "Send GET Request",
  description: "Send an HTTP GET request to any URL. Optionally configure query string parameters, headers and basic auth.",
  type: "action",
  version: "1.0.1",
  props: {
    ...customRequest.props,
    /* eslint-disable-next-line pipedream/props-label,pipedream/props-description */
    httpRequest: {
      ...customRequest.props.httpRequest,
      default: {
        method: "GET",
      },
    },
  },
};
