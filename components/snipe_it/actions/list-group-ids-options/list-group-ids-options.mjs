import snipe_it from "../../snipe_it.app.mjs";

export default {
  key: "snipe_it-list-group-ids-options",
  name: "List Groups Options",
  description: "Retrieves available options for the Groups field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    snipe_it,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await snipe_it.propDefinitions.groupIds.options.call(this.snipe_it, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
