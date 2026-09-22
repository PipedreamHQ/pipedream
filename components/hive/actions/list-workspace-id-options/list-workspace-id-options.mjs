import hive from "../../hive.app.mjs";

export default {
  key: "hive-list-workspace-id-options",
  name: "List Workspace Id Options",
  description: "Retrieves available options for the Workspace Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hive,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await hive.propDefinitions.workspaceId.options.call(this.hive, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
