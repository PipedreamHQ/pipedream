import lucca from "../../lucca.app.mjs";

export default {
  key: "lucca-list-leave-request-id-options",
  name: "List Leave Request ID Options",
  description: "Retrieves available options for the Leave Request ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    lucca,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await lucca.propDefinitions.leaveRequestId.options.call(this.lucca, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
