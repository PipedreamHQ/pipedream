import fs from "fs";
import mime from "mime-types";
import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-download-attachment",
  name: "Download Attachment",
  description: "Downloads an attachment to the /tmp directory. [See the documentation](https://learn.microsoft.com/en-us/graph/api/attachment-get?view=graph-rest-1.0&tabs=http)",
  version: "0.0.4",
  type: "action",
  props: {
    microsoftOutlook,
    messageId: {
      propDefinition: [
        microsoftOutlook,
        "messageId",
      ],
      description: "The identifier of the message containing the attachment to download",
    },
    attachmentId: {
      propDefinition: [
        microsoftOutlook,
        "attachmentId",
        (c) => ({
          messageId: c.messageId,
        }),
      ],
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename to save the attachment as in the /tmp directory",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const response = await this.microsoftOutlook.getAttachment({
      $,
      messageId: this.messageId,
      attachmentId: this.attachmentId,
      responseType: "arraybuffer",
    });

    const rawcontent = response.toString("base64");
    const buffer = Buffer.from(rawcontent, "base64");
    const downloadedFilepath = `/tmp/${this.filename}`;
    fs.writeFileSync(downloadedFilepath, buffer);
    const contentType = mime.lookup(downloadedFilepath);

    return {
      fileName: this.filename,
      contentType,
      filePath: downloadedFilepath,
    };
  },
};
