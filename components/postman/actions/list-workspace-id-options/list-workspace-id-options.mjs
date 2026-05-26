import postman from "../../postman.app.mjs";

export default {
  key: "postman-list-workspace-id-options",
  name: "List Workspace ID Options",
  description: "Retrieves available options for the Workspace ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    postman,
  },
  async run({ $ }) {
    const options = await postman.propDefinitions.workspaceId.options.call(this.postman);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
