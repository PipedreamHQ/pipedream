import picqer from "../../picqer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "picqer-check-return-receipt",
  name: "Check Return Receipt",
  description: "Check the return receipt in Picqer. [See the documentation](https://picqer.com/en/api/returns)",
  version: "0.0.1",
  type: "action",
  props: {
    picqer,
    returnId: {
      propDefinition: [
        picqer,
        "returnId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.picqer.checkReturnReceipt({
      returnId: this.returnId,
    });
    $.export("$summary", `Successfully retrieved return receipt for Return ID: ${this.returnId}`);
    return response;
  },
};
