import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-list-virtual-terminal-code-options",
  name: "List Virtual Terminal Code Options",
  description: "Retrieves available options for the Virtual Terminal Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    paystack,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await paystack.propDefinitions.virtualTerminalCode.options.call(this.paystack, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
