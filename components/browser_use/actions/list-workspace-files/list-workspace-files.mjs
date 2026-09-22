import browserUse from "../../browser_use.app.mjs";
import { cleanObject } from "../../common/utils.mjs";

export default {
  key: "browser_use-list-workspace-files",
  name: "List Workspace Files",
  description: "List files and folders in a Browser Use workspace, optionally returning presigned download URLs. [See the documentation](https://docs.browser-use.com/cloud/api-v3/workspaces/list-workspace-files)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    prefix: {
      type: "string",
      label: "Prefix",
      description: "Optional directory prefix to list. Example: `reports/`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of files to return. Maximum: `100`.",
      optional: true,
      default: 50,
      min: 1,
      max: 100,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Pagination cursor from a previous response.",
      optional: true,
    },
    includeUrls: {
      type: "boolean",
      label: "Include URLs",
      description: "If true, include presigned download URLs for files.",
      optional: true,
      default: false,
    },
    shallow: {
      type: "boolean",
      label: "Shallow",
      description: "If true, list only immediate files and folders at the prefix.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.listWorkspaceFiles({
      $,
      workspaceId: this.workspaceId,
      params: cleanObject({
        prefix: this.prefix,
        limit: this.limit,
        cursor: this.cursor,
        includeUrls: this.includeUrls,
        shallow: this.shallow,
      }),
    });

    $.export("$summary", `Retrieved ${response.files?.length ?? 0} files from workspace ${this.workspaceId}`);
    return response;
  },
};
