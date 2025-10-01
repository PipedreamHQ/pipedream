import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Generic API Call",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bybit-generic-api-call",
  description: "Make any API call as per the documentation." +
      "[reference](https://bybit-exchange.github.io/docs/futuresV2/inverse/#t-introduction)",
  props: {
    bybit,
    http_method: {
      label: "HTTP Method",
      description: "HTTP Method as per API documentation",
      type: "string",
      optional: false,
      options: [
        "GET",
        "POST",
      ],
    },
    api_path: {
      label: "API Path",
      description: "Ex. /derivatives/v3/public/order-book/L2",
      type: "string",
      optional: false,
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
    const returnValue = await this.bybit.makeRequest(this.http_method, this.api_path, this.params);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Bybit custom action successful");
    }
    return returnValue;
  },
};
