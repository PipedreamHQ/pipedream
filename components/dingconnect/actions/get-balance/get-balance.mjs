import dingconnect from "../../dingconnect.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dingconnect-get-balance",
  name: "Get Balance",
  description: "Get the current agent balance from DingConnect. [See the documentation](https://www.dingconnect.com/api#operation/getbalance)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dingconnect,
  },
  async run({ $ }) {
    const response = await this.dingconnect.getBalance();
    $.export("$summary", "Retrieved the current agent balance successfully");
    return response;
  },
};
