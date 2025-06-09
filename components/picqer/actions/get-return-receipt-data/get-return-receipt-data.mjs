import picqer from "../../picqer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "picqer-get-return-receipt-data",
  name: "Get Return Receipt Data",
  description: "Get the data of a return receipt in Picqer. [See the documentation](https://picqer.com/en/api/returns)",
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
    const response = await this.picqer.getReturnReceiptData({
      returnId: this.returnId,
    });

    $.export("$summary", `Successfully retrieved return receipt data for ID: ${this.returnId}`);
    return response;
  },
};
