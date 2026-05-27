import wufoo from "../../wufoo.app.mjs";

export default {
  key: "wufoo-list-form-hash-options",
  name: "List Form Hash Options",
  description: "Retrieves available options for the Form Hash field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wufoo,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await wufoo.propDefinitions.formHash.options.call(this.wufoo, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
