import confluence_data_center from "../../confluence_data_center.app.mjs";

export default {
  key: "confluence_data_center-list-space-key-options",
  name: "List Space Key Options",
  description: "Retrieves available options for the Space Key field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    confluence_data_center,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await confluence_data_center.propDefinitions.spaceKey.options
      .call(this.confluence_data_center, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
