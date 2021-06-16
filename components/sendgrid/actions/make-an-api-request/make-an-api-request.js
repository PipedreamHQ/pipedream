const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-make-an-api-request",
  name: "Make An API Request",
  description: "Makes an aribitrary call to Sendgrid API.",
  version: "0.0.9",
  type: "action",
  props: {
    sendgrid,
    requestMethod: {
      type: "string",
      label: "Request Method",
      description: "Http method to use in the request.",
      options: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
      ],
    },
    relativeUrl: {
      type: "string",
      label: "Relative URL",
      description:
        "A path relative to Sendgrid API to send the request against.",
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Headers to send in the request. Authorization headers will already be included.",
      optional: true
    },
    requestBody: {
      type: "object",
      label: "Request Body",
      description: "Body of the request.",
      optional: true
    },
  },
  async run() {
    if (!this.requestMethod || !this.relativeUrl) {
      throw new Error(
        "Must provide requestMethod, and relativeUrl parameters."
      );
    }
    return await this.sendgrid.makeAnAPICall(
      this.requestMethod,
      this.relativeUrl,
      this.headers,
      this.requestBody
    );
  },
};
