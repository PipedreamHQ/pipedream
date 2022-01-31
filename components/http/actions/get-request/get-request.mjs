import customRequest from "../custom-request/custom-request.mjs";

export default {
  ...customRequest,
  key: "http-get-request",
  name: "GET Request",
  description: "Make an HTTP GET request to any URL. Optionally configure query string parameters, headers and basic auth.",
  type: "action",
  version: "0.1.2",
  props: {
    ...customRequest.props,
    method: {
      type: "string",
      label: "Method",
      static: "GET",
    },
  },
};
