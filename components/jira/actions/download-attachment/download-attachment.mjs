import path from "path";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import { ConfigurationError } from "@pipedream/platform";
import jira from "../../jira.app.mjs";

const PIPELINE = promisify(stream.pipeline);

export default {
  key: "jira-download-attachment",
  name: "Download Attachment",
  description: "Downloads a Jira issue attachment's binary content to the configured file-stash directory and"
    + " returns its saved path plus the attachment's metadata (`filename`, `mimeType`, `size`, etc.)."
    + " Use this after locating an attachment via **Get Issue** (its `fields.attachment[]` array"
    + " lists each attachment's `id`, `filename`, `size`, and `mimeType`), or from an attachment"
    + " reference surfaced by another Jira action or trigger — pass that `id` as `attachmentId`."
    + " The file is saved in the file-stash directory as `<attachmentId>-<sanitized filename>` (the ID"
    + " prefix avoids collisions when multiple attachments share the same filename); the returned"
    + " `filedata` tuple points at that saved path for use in downstream file-input props."
    + " Jira's content endpoint responds with a redirect to a signed, short-lived media URL —"
    + " this is followed automatically, so no extra configuration is required."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-attachments/#api-rest-api-3-attachment-content-id-get)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    attachmentId: {
      type: "string",
      label: "Attachment ID",
      description: "The numeric ID of the attachment to download, e.g. `10001`. This can be found in the `id` field of an attachment object, e.g. from an issue's `fields.attachment[].id` array (see the **Get Issue** action).",
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

    const metadata = await this.jira.getAttachmentMetadata({
      $,
      cloudId: this.cloudId,
      attachmentId: this.attachmentId,
    });

    const safeFilename = path.basename(metadata.filename ?? "");
    if (!safeFilename || safeFilename === "." || safeFilename === "..") {
      throw new Error(`Invalid attachment filename "${metadata.filename}" returned by Jira.`);
    }
    const savedFilename = `${this.attachmentId}-${safeFilename}`;
    const stashDir = process.env.STASH_DIR || "/tmp";
    const downloadedFilepath = path.join(stashDir, savedFilename);

    const contentStream = await this.jira.getAttachmentContent({
      $,
      cloudId: this.cloudId,
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

    $.export("$summary", `Successfully downloaded attachment \`${savedFilename}\` to \`${downloadedFilepath}\``);

    return {
      filedata,
      attachment: metadata,
    };
  },
};
