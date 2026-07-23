import path from "path";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import jira from "../../jira.app.mjs";

const pipeline = promisify(stream.pipeline);

export default {
  key: "jira-download-attachment",
  name: "Download Attachment",
  description: "Downloads a Jira issue attachment's binary content to the `/tmp` directory and"
    + " returns its saved path plus the attachment's metadata (`filename`, `mimeType`, `size`, etc.)."
    + " Use this after locating an attachment via **Get Issue** (its `fields.attachment[]` array"
    + " lists each attachment's `id`, `filename`, `size`, and `mimeType`), or from an attachment"
    + " reference surfaced by another Jira action or trigger — pass that `id` as `attachmentId`."
    + " The file is saved as `/tmp/<attachmentId>-<sanitized filename>` (the ID prefix avoids"
    + " collisions when multiple attachments share the same filename); the returned `filedata`"
    + " tuple points at that saved path for use in downstream file-input props."
    + " Jira's content endpoint responds with a redirect to a signed, short-lived media URL —"
    + " this is followed automatically, so no extra configuration is required."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-attachments/#api-rest-api-3-attachment-content-id--get)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      description: "The ID of the attachment to download. This can be found in the `id` field of an attachment object, e.g. from an issue's `fields.attachment` array (see the **Get Issue** action).",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
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
    const downloadedFilepath = `/tmp/${savedFilename}`;

    const contentStream = await this.jira.getAttachmentContent({
      $,
      cloudId: this.cloudId,
      attachmentId: this.attachmentId,
    });
    await pipeline(contentStream, fs.createWriteStream(downloadedFilepath));

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
