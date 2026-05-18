import beekeeper from "../../beekeeper.app.mjs";

export default {
  key: "beekeeper-list-user-id-options",
  name: "List User ID Options",
  description: "Retrieves available options for the User ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    beekeeper,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await beekeeper.propDefinitions.userId.options
      .call(this.beekeeper, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
