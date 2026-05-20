import freshmarketer from "../../freshmarketer.app.mjs";

export default {
  key: "freshmarketer-list-owner-id-options",
  name: "List Owner ID Options",
  description: "Retrieves available options for the Owner ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    freshmarketer,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await freshmarketer.propDefinitions.ownerId.options.call(this.freshmarketer, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
