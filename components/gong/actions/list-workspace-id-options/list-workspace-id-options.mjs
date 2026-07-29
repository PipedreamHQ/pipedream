// x-pd-ai: optimized
import gong from "../../gong.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gong-list-workspace-id-options",
  name: "List Workspace ID Options",
  description: `List the company's Gong workspaces as \`{ label, value }\` pairs, where \`value\` is the workspace ID. Most Gong accounts have a single workspace, so you usually only need this when an action's **Workspace ID** filter matters. Call it first to resolve a workspace name to the ID that **List Calls**, **Search Calls**, **Get Call Transcripts**, and **List Library Folders** accept. [See the documentation](${constants.DOCS_URL}#get-/v2/workspaces)`,
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gong,
  },
  async run({ $ }) {
    const options = await gong.propDefinitions.workspaceId.options.call(this.gong);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
