import connectwise_psa from "../../connectwise_psa.app.mjs";

export default {
  key: "connectwise_psa-list-priority-options",
  name: "List Priority Options",
  description: "Retrieves available options for the Priority field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    connectwise_psa,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await connectwise_psa.propDefinitions.priority.options
      .call(this.connectwise_psa, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
