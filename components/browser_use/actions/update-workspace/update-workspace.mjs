import browserUse from "../../browser_use.app.mjs";
import { cleanObject } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "browser_use-update-workspace",
  name: "Update Workspace",
  description: "Update a Browser Use workspace name. [See the documentation](https://docs.browser-use.com/cloud/api-v3/workspaces/update-workspace)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    browserUse,
    workspaceId: {
      propDefinition: [
        browserUse,
        "workspaceId",
      ],
      optional: false,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Updated workspace name. Maximum length: `100` characters.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.name) {
      throw new ConfigurationError("Provide a workspace Name to update.");
    }

    const response = await this.browserUse.updateWorkspace({
      $,
      workspaceId: this.workspaceId,
      data: cleanObject({
        name: this.name,
      }),
    });

    $.export("$summary", `Updated workspace ${response.id}`);
    return response;
  },
};
