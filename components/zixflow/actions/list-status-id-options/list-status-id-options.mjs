import zixflow from "../../zixflow.app.mjs";

export default {
  key: "zixflow-list-status-id-options",
  name: "List Status ID Options",
  description: "Retrieves available options for the Status ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zixflow,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await zixflow.propDefinitions.statusId.options.call(this.zixflow, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
