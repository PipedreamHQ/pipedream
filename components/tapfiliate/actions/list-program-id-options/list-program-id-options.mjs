import tapfiliate from "../../tapfiliate.app.mjs";

export default {
  key: "tapfiliate-list-program-id-options",
  name: "List Program ID Options",
  description: "Retrieves available options for the Program ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tapfiliate,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await tapfiliate.propDefinitions.programId.options.call(this.tapfiliate, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
