import nifty from "../../nifty.app.mjs";

export default {
  key: "nifty-list-label-ids-options",
  name: "List Label IDs Options",
  description: "Retrieves available options for the Label IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nifty,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await nifty.propDefinitions.labelIds.options.call(this.nifty, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
