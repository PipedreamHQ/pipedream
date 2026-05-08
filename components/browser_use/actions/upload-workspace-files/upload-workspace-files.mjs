import fs from "fs";
import path from "path";
import browserUse from "../../browser_use.app.mjs";
import {
  cleanObject,
  parseFileUploadItems,
} from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "browser_use-upload-workspace-files",
  name: "Upload Workspace Files",
  description: "Create presigned upload URLs for Browser Use workspace files, and optionally upload local Pipedream files to those URLs. [See the documentation](https://docs.browser-use.com/cloud/api-v3/workspaces/upload-workspace-files)",
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
    prefix: {
      type: "string",
      label: "Prefix",
      description: "Optional directory prefix to upload into. Example: `uploads/`.",
      optional: true,
    },
    filePaths: {
      type: "string[]",
      label: "Local File Paths",
      description: "Optional local Pipedream file paths to upload, usually under `/tmp`. Example: `/tmp/report.csv`. Names are derived from each path.",
      optional: true,
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "Content type to use for local file path uploads. Example: `text/csv`.",
      optional: true,
      default: "application/octet-stream",
    },
    filesJson: {
      type: "string",
      label: "File Upload Items JSON",
      description: "Optional JSON array of file metadata for presigned URLs without uploading local files. Example: `[{\"name\":\"data.csv\",\"contentType\":\"text/csv\",\"size\":1234}]`. Browser Use accepts 1 to 10 files per request.",
      optional: true,
    },
  },
  async run({ $ }) {
    const localFiles = [];
    for (const filePath of this.filePaths ?? []) {
      const stat = await fs.promises.stat(filePath);
      if (!stat.isFile()) {
        throw new ConfigurationError(`Local file path \`${filePath}\` is not a file.`);
      }
      localFiles.push({
        name: path.basename(filePath),
        contentType: this.contentType,
        size: stat.size,
        filePath,
      });
    }

    const metadataFiles = parseFileUploadItems(this.filesJson);
    const files = [
      ...localFiles.map(({
        name, contentType, size,
      }) => ({
        name,
        contentType,
        size,
      })),
      ...metadataFiles,
    ];

    if (!files.length) {
      throw new ConfigurationError("Provide at least one local file path or File Upload Items JSON entry.");
    }
    if (files.length > 10) {
      throw new ConfigurationError("Browser Use accepts a maximum of 10 files per upload URL request.");
    }

    const uploadResponse = await this.browserUse.uploadWorkspaceFiles({
      $,
      workspaceId: this.workspaceId,
      params: cleanObject({
        prefix: this.prefix,
      }),
      data: {
        files,
      },
    });

    const uploadedFiles = [];
    for (let index = 0; index < localFiles.length; index++) {
      const localFile = localFiles[index];
      const upload = uploadResponse.files?.[index];
      if (!upload?.uploadUrl) {
        throw new ConfigurationError(`Browser Use did not return an upload URL for ${localFile.name}.`);
      }

      const content = await fs.promises.readFile(localFile.filePath);
      await this.browserUse.uploadToPresignedUrl({
        $,
        uploadUrl: upload.uploadUrl,
        content,
        contentType: localFile.contentType,
      });
      uploadedFiles.push({
        name: localFile.name,
        path: upload.path,
      });
    }

    $.export("$summary", localFiles.length
      ? `Uploaded ${uploadedFiles.length} files to workspace ${this.workspaceId}`
      : `Created ${uploadResponse.files?.length ?? 0} upload URLs for workspace ${this.workspaceId}`);

    return {
      uploadResponse,
      uploadedFiles,
    };
  },
};
