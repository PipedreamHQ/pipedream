import stormboard from "../../stormboard.app.mjs";

export default {
  key: "stormboard-list-storm-id-options",
  name: "List Storm Id Options",
  description: "Retrieves available options for the Storm Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    stormboard,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await stormboard.propDefinitions.stormId.options.call(this.stormboard, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
