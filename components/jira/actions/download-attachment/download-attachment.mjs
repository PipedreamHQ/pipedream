import jira from "../../jira.app.mjs";
import fs from "fs";

export default {
  key: "jira-download-attachment",
  name: "Download Attachment",
  description: "Downloads an attachment from Jira. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-attachments/#api-rest-api-3-attachment-content-id--get)",
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

    const content = await this.jira.getAttachmentContent({
      $,
      cloudId: this.cloudId,
      attachmentId: this.attachmentId,
    });

    const buffer = Buffer.from(content);
    const downloadedFilepath = `/tmp/${metadata.filename}`;
    fs.writeFileSync(downloadedFilepath, buffer);

    const filedata = [
      metadata.filename,
      downloadedFilepath,
    ];

    $.export("$summary", `Successfully downloaded attachment \`${metadata.filename}\` to \`${downloadedFilepath}\``);

    return {
      filedata,
      attachment: metadata,
    };
  },
};
