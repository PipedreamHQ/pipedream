import toggl from "../../toggl.app.mjs";

export default {
  key: "toggl-list-workspace-id-options",
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
    toggl,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await toggl.propDefinitions.workspaceId.options.call(this.toggl, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
