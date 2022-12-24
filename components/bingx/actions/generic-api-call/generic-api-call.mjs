import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Generic API Call",
  version: "0.0.1",
  key: "bingx-generic-api-call",
  description: "Make any API call for Bingx Futures as per the documentation." +
        "See docs [here](https://bingx-api.github.io/docs/swap/)",
  props: {
    bingx,
    httpMethod: {
      label: "HTTP Method",
      description: "HTTP Method as per API documentation",
      type: "string",
      options: [
        "GET",
        "DELETE",
        "POST",
        "PUT",
      ],
      default: "POST",
    },
    apiPath: {
      label: "API Path",
      description: "Ex. api/v1/market/getAllContracts",
      type: "string",
    },
    params: {
      label: "Parameters",
      description: "API Parameters",
      type: "object",
      optional: true,
    },
  },
  type: "action",
  async run({ $ }) {
    if (!this.apiPath.startsWith("/")) {
      throw new Error("Api Path property should always start with `/` as a path like string");
    }
    const returnValue = await this.bingx.makeRequest(
      this.httpMethod, this.apiPath, this.params,
    );
    if (returnValue["ret_code"]) {
      throw new Error(returnValue["ret_msg"]);
    } else {
      $.export("$summary", "Bingx Futures custom action successful");
    }
    return returnValue;
  },
};
