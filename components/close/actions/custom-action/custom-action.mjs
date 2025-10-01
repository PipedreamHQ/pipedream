import close from "../../close.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "close-custom-action",
  name: "Custom Action",
  description: "Makes an arbitrary call to the Close API. [See the documentation](https://developer.close.com/) for all options.",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    close,
    requestMethod: {
      type: "string",
      label: "Request Method",
      description: "Http method to use in the request",
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
      label: "Relative url",
      description: "A path relative to Close API to send the request against. e.g. `/lead`",
    },
    queryString: {
      type: "string",
      label: "Query string",
      description: "Query string of the request",
      optional: true,
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Headers to be sent in the request",
      optional: true,
    },
    requestBody: {
      type: "object",
      label: "Request body",
      description: "Body of the request",
      optional: true,
    },
  },
  async run({ $ }) {
    this.queryString = this.queryString || "";
    const requestBody = {};
    for (let key in this.requestBody) {
      requestBody[key] = utils.parseObject(this.requestBody[key]);
    }
    const response = await this.close._makeRequest({
      method: this.requestMethod,
      path: `${this.relativeUrl}${this.queryString}`,
      headers: this.headers,
      data: this.requestBody,
    });
    $.export("$summary", "Configured request has been sent.");
    return response;
  },
};
