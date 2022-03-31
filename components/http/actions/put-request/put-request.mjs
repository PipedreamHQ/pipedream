import customRequest from "../custom-request/custom-request.mjs";

export default {
  ...customRequest,
  key: "http-put-request",
  name: "PUT Request",
  description: "Make an HTTP PUT request to any URL. Optionally configure query string parameters, headers and basic auth.",
  type: "action",
  version: "0.1.3",
  props: {
    ...customRequest.props,
    method: {
      type: "string",
      label: "Method",
      description: "The HTTP method (for example, `GET` or `POST`)",
      static: "PUT",
    },
  },
};
