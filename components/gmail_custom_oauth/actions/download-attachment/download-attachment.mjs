import gmail from "../../gmail_custom_oauth.app.mjs";
import fs from "fs";
import path from "path";

export default {
  key: "gmail_custom_oauth-download-attachment",
  name: "Download Attachement",
  description: "Download an attachment by attachmentId to the /tmp directory. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages.attachments/get)",
  version: "0.0.5",
  type: "action",
  props: {
    gmail,
    messageId: {
      propDefinition: [
        gmail,
        "message",
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
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Name of the new file. Example: `test.jpg`",
    },
  },
  async run({ $ }) {
    const attachment = await this.gmail.getAttachment({
      messageId: this.messageId,
      attachmentId: this.attachmentId,
    });

    const filePath = path.join("/tmp", this.filename);
    const buffer = Buffer.from(attachment.data, "base64");
    fs.writeFileSync(filePath, buffer);

    $.export("$summary", `Successfully created file ${this.filename} in \`/tmp\` directory`);

    return {
      filePath,
      ...attachment,
    };
  },
};
