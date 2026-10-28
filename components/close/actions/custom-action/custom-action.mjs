import { ConfigurationError } from "@pipedream/platform";
import close from "../../close.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "close-custom-action",
  name: "Custom Action",
  description: "Makes an arbitrary call to the Close API. [See the documentation](https://developer.close.com/) for all options.",
  version: "1.0.0",
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
      description: "Body of the request (JSON object), e.g. `{\"name\": \"Acme Inc.\"}`",
      optional: true,
    },
  },
  async run({ $ }) {
    this.queryString = this.queryString || "";
    const requestBody = typeof this.requestBody === "string"
      ? utils.parseObject(this.requestBody)
      : this.requestBody;
    if (this.requestBody
      && (!requestBody || typeof requestBody !== "object" || Array.isArray(requestBody))) {
      throw new ConfigurationError("`Request body` must be a JSON object");
    }
    const response = await this.close._makeRequest({
      $,
      method: this.requestMethod,
      path: `${this.relativeUrl}${this.queryString}`,
      headers: this.headers,
      data: requestBody || undefined,
    });
    $.export("$summary", "Configured request has been sent.");
    return response.data;
  },
};
