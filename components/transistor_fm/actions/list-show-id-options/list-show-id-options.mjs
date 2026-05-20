import transistor_fm from "../../transistor_fm.app.mjs";

export default {
  key: "transistor_fm-list-show-id-options",
  name: "List Show ID Options",
  description: "Retrieves available options for the Show ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    transistor_fm,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await transistor_fm.propDefinitions.showId.options.call(this.transistor_fm, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
