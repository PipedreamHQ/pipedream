import loop_returns from "../../loop_returns.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "loop_returns-cancel-return",
  name: "Cancel Return",
  description: "Cancels a pending return request in Loop. [See the documentation](https://docs.loopreturns.com/reference/post_warehouse-return-return-id-cancel)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    loop_returns,
    returnId: {
      propDefinition: [
        loop_returns,
        "returnId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.loop_returns.cancelReturn({
      returnId: this.returnId,
    });

    $.export("$summary", `Successfully cancelled return with ID ${this.returnId}`);
    return response;
  },
};
