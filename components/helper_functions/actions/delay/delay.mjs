// legacy_hash_id: a_m8iXpW
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-delay",
  name: "Delay by N milliseconds",
  description: "Delays the execution of your workflow for the specified number of milliseconds",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helper_functions,
    ms: {
      type: "string",
      label: "Number of milliseconds to delay workflow execution",
    },
  },
  async run({ $ }) {
    await new Promise((resolve) => setTimeout(resolve, this.ms || 0));
    $.export("$summary", `Workflow successfully delayed for ${this.ms} ms`);
  },
};
