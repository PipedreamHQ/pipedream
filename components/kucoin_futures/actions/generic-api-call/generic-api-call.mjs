import kucoin_futures from "../../kucoin_futures.mjs";

export default {
  name: "Kucoin Futures Generic API Call",
  version: "0.0.1",
  key: "kucoin_futures-generic-api-call",
  description: "Make any API call for Kucoin Futures as per the documentation." +
        "[reference](https://docs.kucoin.com/futures/#general)",
  props: {
    kucoin_futures,
    http_method: {
      label: "HTTP Method",
      description: "HTTP Method as per API documentation",
      type: "string",
      optional: false,
      options: [
        "GET",
        "DELETE",
        "POST",
        "PUT",
      ],
    },
    api_path: {
      label: "API Path",
      description: "Ex. /api/v1/orders",
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
    const returnValue = await this.kucoin_futures.makeRequest(
      this.http_method, this.api_path, this.params,
    );
    if (returnValue["ret_code"]) {
      throw new Error(returnValue["ret_msg"]);
    } else {
      $.export("$summary", "Kucoin Futures custom action successful");
    }
    return returnValue;
  },
};
