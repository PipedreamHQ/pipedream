import path from "path";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import { ConfigurationError } from "@pipedream/platform";
import jiraServiceDesk from "../../jira_service_desk.app.mjs";
import constants from "../../common/constants.mjs";

const PIPELINE = promisify(stream.pipeline);

export default {
  key: "jira_service_desk-download-issue-attachment",
  name: "Download Issue Attachment",
  description: "Download the binary content of a Jira Service Desk attachment to the file-stash directory, returning the saved path plus the attachment metadata (`filename`, `mimeType`, `size`). Run **List Issue Attachments** first to obtain the attachment `id`, then pass both it and the same `issueIdOrKey` here. Example: passing `issueIdOrKey` `IT-42` and `attachmentId` `10042` downloads `screenshot.png` to `/tmp/10042-screenshot.png` and returns `{ \"filedata\": [\"10042-screenshot.png\", \"/tmp/10042-screenshot.png\"], \"attachment\": { \"id\": \"10042\", \"filename\": \"screenshot.png\", \"mimeType\": \"image/png\", \"size\": 84213 } }`. [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-issueidorkey-attachment-attachmentid-get)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    jiraServiceDesk,
    cloudId: {
      propDefinition: [
        jiraServiceDesk,
        "cloudId",
      ],
    },
    issueIdOrKey: {
      propDefinition: [
        jiraServiceDesk,
        "issueIdOrKey",
      ],
    },
    attachmentId: {
      type: "string",
      label: "Attachment ID",
      description: "The numeric ID of the attachment to download, e.g. `10042`. Run **List Issue Attachments** first to obtain the ID from an attachment's `id` field.",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    if (!/^\d+$/.test(this.attachmentId)) {
      throw new ConfigurationError(`Invalid attachment ID "${this.attachmentId}". Attachment IDs must be numeric.`);
    }

    const { attachments } = await this.jiraServiceDesk.getIssueAttachments({
      $,
      cloudId: this.cloudId,
      issueIdOrKey: this.issueIdOrKey,
      maxResults: constants.MAX_RESULTS_MAX,
    });
    const metadata = attachments.find(({ id }) => id === this.attachmentId);
    if (!metadata) {
      throw new ConfigurationError(`Attachment ID "${this.attachmentId}" was not found on issue "${this.issueIdOrKey}". Run List Issue Attachments to confirm the ID and issue match. If this connection has customer-level access, note that internal (non-public) attachments aren't visible to it even if they exist.`);
    }
    if (metadata.size > constants.MAX_ATTACHMENT_SIZE_BYTES) {
      throw new ConfigurationError(`Attachment "${metadata.filename}" is ${metadata.size} bytes, which exceeds the ${constants.MAX_ATTACHMENT_SIZE_BYTES}-byte (2GB) /tmp disk limit for this execution, so it cannot be downloaded.`);
    }

    const safeFilename = path.basename(metadata.filename ?? "");
    if (!safeFilename || safeFilename === "." || safeFilename === "..") {
      throw new Error(`Invalid attachment filename "${metadata.filename}" returned by Jira.`);
    }
    const savedFilename = `${this.attachmentId}-${safeFilename}`;
    const stashDir = process.env.STASH_DIR || "/tmp";
    const downloadedFilepath = path.join(stashDir, savedFilename);

    const contentStream = await this.jiraServiceDesk.getAttachmentContent({
      $,
      cloudId: this.cloudId,
      issueIdOrKey: this.issueIdOrKey,
      attachmentId: this.attachmentId,
    });
    try {
      await PIPELINE(contentStream, fs.createWriteStream(downloadedFilepath));
    } catch (error) {
      await fs.promises.rm(downloadedFilepath, {
        force: true,
      }).catch(() => {});
      throw error;
    }

    const filedata = [
      savedFilename,
      downloadedFilepath,
    ];

    $.export("$summary", `Downloaded ${metadata.filename} (${metadata.size} bytes)`);

    return {
      filedata,
      attachment: metadata,
    };
  },
};
