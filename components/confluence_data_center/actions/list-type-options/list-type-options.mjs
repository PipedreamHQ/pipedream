import confluence_data_center from "../../confluence_data_center.app.mjs";

export default {
  key: "confluence_data_center-list-type-options",
  name: "List Type Options",
  description: "Retrieves available options for the Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    confluence_data_center,
  },
  async run({ $ }) {
    const options = await confluence_data_center.propDefinitions.type.options
      .call(this.confluence_data_center);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
