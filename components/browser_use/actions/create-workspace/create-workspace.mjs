import browserUse from "../../browser_use.app.mjs";
import { cleanObject } from "../../common/utils.mjs";

export default {
  key: "browser_use-create-workspace",
  name: "Create Workspace",
  description: "Create a Browser Use workspace for persistent shared file storage across sessions. [See the documentation](https://docs.browser-use.com/cloud/api-v3/workspaces/create-workspace)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    browserUse,
    name: {
      type: "string",
      label: "Name",
      description: "Optional workspace name. Maximum length: `100` characters.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.createWorkspace({
      $,
      data: cleanObject({
        name: this.name,
      }),
    });

    $.export("$summary", `Created workspace ${response.id}`);
    return response;
  },
};
