import kucoinFutures from "../../kucoin_futures.app.mjs";

export default {
  name: "Kucoin Futures Generic API Call",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "kucoin_futures-generic-api-call",
  description: "Make any API call for Kucoin Futures as per the documentation." +
        "See docs [here](https://docs.kucoin.com/futures/#general)",
  props: {
    kucoinFutures,
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
    },
    apiPath: {
      label: "API Path",
      description: "Ex. /api/v1/orders",
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
    const returnValue = await this.kucoinFutures.makeRequest(
      this.httpMethod, this.apiPath, this.params,
    );
    if (returnValue["ret_code"]) {
      throw new Error(returnValue["ret_msg"]);
    } else {
      $.export("$summary", "Kucoin Futures custom action successful");
    }
    return returnValue;
  },
};
