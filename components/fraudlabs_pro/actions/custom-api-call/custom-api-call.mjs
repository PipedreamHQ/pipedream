import { ConfigurationError } from "@pipedream/platform";
import fraudlabsProApp from "../../fraudlabs_pro.app.mjs";

export default {
  key: "fraudlabs_pro-custom-api-call",
  name: "Custom API Call",
  description: "Make an authenticated request to any FraudLabs Pro v2 REST endpoint. The base URL `https://api.fraudlabspro.com/v2` and your API key are added automatically. [See the docs](https://www.fraudlabspro.com/developer).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fraudlabsProApp,
    relativeUrl: {
      type: "string",
      label: "Relative URL",
      description: "Path relative to `https://api.fraudlabspro.com/v2`, starting with `/`. For example, `/order/screen` or `/order/result`.",
    },
    requestMethod: {
      type: "string",
      label: "Request Method",
      description: "HTTP method to use in the request.",
      options: [
        "get",
        "post",
        "put",
        "patch",
        "delete",
      ],
      default: "get",
    },
    params: {
      type: "object",
      label: "Query Parameters",
      description: "Query parameters to send with the request. Authentication (`key`) and response format (`format=json`) are added automatically.",
      optional: true,
    },
    requestBody: {
      type: "object",
      label: "Request Body",
      description: "Body of the request, for POST/PUT/PATCH calls.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      relativeUrl,
      requestMethod,
      params,
      requestBody,
    } = this;

    if (!relativeUrl || !relativeUrl.startsWith("/")) {
      throw new ConfigurationError("**Relative URL** must start with `/`, for example `/order/screen`.");
    }

    const response = await this.fraudlabsProApp._apiRequest({
      $,
      method: requestMethod,
      path: relativeUrl,
      params,
      data: requestBody,
    });

    $.export("$summary", `Successfully called \`${requestMethod.toUpperCase()} ${relativeUrl}\``);
    return response;
  },
};
