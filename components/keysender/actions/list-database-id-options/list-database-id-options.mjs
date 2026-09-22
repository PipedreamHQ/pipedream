import keysender from "../../keysender.app.mjs";

export default {
  key: "keysender-list-database-id-options",
  name: "List Database ID Options",
  description: "Retrieves available options for the Database ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    keysender,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await keysender.propDefinitions.databaseId.options.call(this.keysender, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
