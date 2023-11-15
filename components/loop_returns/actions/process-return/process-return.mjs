import loop_returns from "../../loop_returns.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "loop_returns-process-return",
  name: "Process Return",
  description: "Starts the processing of a return inside Loop. Return ID is a required prop to initiate the process. [See the documentation](https://docs.loopreturns.com/reference/post_warehouse-return-return-id-process)",
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
    const response = await this.loop_returns.processReturn({
      returnId: this.returnId,
    });

    $.export("$summary", `Successfully processed return with ID ${this.returnId}`);
    return response;
  },
};
