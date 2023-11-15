import loop_returns from "../../loop_returns.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "loop_returns-flag-return",
  name: "Flag Return",
  description: "Flags a particular return as important inside Loop. Requires return ID as a mandatory prop.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    loop_returns,
    returnId: {
      propDefinition: [
        loop_returns,
        "returnId",
        (c) => ({
          prevContext: c.prevContext,
        }), // Assuming prevContext is a prop that holds pagination context
      ],
    },
  },
  async run({ $ }) {
    const response = await this.loop_returns.flagReturn({
      returnId: this.returnId,
    });
    $.export("$summary", `Successfully flagged return with ID ${this.returnId}`);
    return response;
  },
};
