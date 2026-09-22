import graceblocks from "../../graceblocks.app.mjs";

export default {
  key: "graceblocks-list-record-id-options",
  name: "List Record ID Options",
  description: "Retrieves available options for the Record ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    graceblocks,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await graceblocks.propDefinitions.recordId.options.call(this.graceblocks, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
