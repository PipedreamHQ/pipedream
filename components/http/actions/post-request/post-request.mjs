import customRequest from "../custom-request/custom-request.mjs";

export default {
  ...customRequest,
  key: "http-post-request",
  name: "POST Request",
  description: "Make an HTTP POST request to any URL. Optionally configure query string parameters, headers and basic auth.",
  type: "action",
  version: "0.1.2",
  props: {
    ...customRequest.props,
    method: {
      type: "string",
      label: "Method",
      description: "POST HTTP method",
      static: "POST",
    },
  },
};
