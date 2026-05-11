import browserUse from "../../browser_use.app.mjs";
import { cleanObject } from "../../common/utils.mjs";

export default {
  key: "browser_use-list-workspaces",
  name: "List Workspaces",
  description: "List Browser Use workspaces for persistent shared file storage across sessions. [See the documentation](https://docs.browser-use.com/cloud/api-v3/workspaces/list-workspaces)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    browserUse,
    pageSize: {
      propDefinition: [
        browserUse,
        "pageSize",
      ],
    },
    pageNumber: {
      propDefinition: [
        browserUse,
        "pageNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.listWorkspaces({
      $,
      params: cleanObject({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      }),
    });

    $.export("$summary", `Retrieved ${response.items?.length ?? 0} workspaces`);
    return response;
  },
};
