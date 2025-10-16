import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import path from "path";
import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-download-attachment",
  name: "Download Attachment",
  description: "Download an attachment by attachmentId to the /tmp directory. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages.attachments/get)",
  version: "0.0.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gmail,
    messageId: {
      propDefinition: [
        gmail,
        "messageWithAttachments",
      ],
    },
    attachmentId: {
      propDefinition: [
        gmail,
        "attachmentId",
        ({ messageId }) => ({
          messageId,
        }),
      ],
      withLabel: true,
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Name of the new file. Example: `test.jpg`",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const attachmentId = this.attachmentId.value || this.attachmentId;

    const attachment = await this.gmail.getAttachment({
      messageId: this.messageId,
      attachmentId,
    });

    const filename = this.filename || this.attachmentId.label;
    if (!filename) {
      throw new ConfigurationError("Please enter a filename to save the downloaded file as in the `/tmp` directory.");
    }

    const filePath = path.join("/tmp", filename);
    const buffer = Buffer.from(attachment.data, "base64");
    fs.writeFileSync(filePath, buffer);

    $.export("$summary", `Successfully created file ${filename} in \`/tmp\` directory`);

    return {
      filename,
      filePath,
    };
  },
};
