import common from "../../common/verify-client-id.mjs";
import fs from "fs";
import path from "path";

export default {
  ...common,
  key: "gmail-download-attachment",
  name: "Download Attachement",
  description: "Download an attachment by attachmentId to the /tmp directory. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages.attachments/get)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    messageId: {
      propDefinition: [
        common.props.gmail,
        "message",
      ],
    },
    attachmentId: {
      propDefinition: [
        common.props.gmail,
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
    };
  },
};
