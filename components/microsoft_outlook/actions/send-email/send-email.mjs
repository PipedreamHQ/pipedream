import microsoftOutlook from "../../microsoft_outlook.app.mjs";
import fs from "fs";
import { encode } from "js-base64";

export default {
  name: "Send email",
  description: "Send an email to one or multiple recipients",
  key: "microsoft_outlook-send_email",
  version: "0.0.1",
  type: "action",
  props: {
    microsoftOutlook,
    recipients: {
      propDefinition: [
        microsoftOutlook,
        "recipients",
      ],
    },
    subject: {
      propDefinition: [
        microsoftOutlook,
        "subject",
      ],
    },
    content: {
      propDefinition: [
        microsoftOutlook,
        "content",
      ],
    },
    name: {
      propDefinition: [
        microsoftOutlook,
        "name",
      ],
    },
    mimetype: {
      propDefinition: [
        microsoftOutlook,
        "mimetype",
      ],
    },
    path: {
      propDefinition: [
        microsoftOutlook,
        "path",
      ],
    },
  },
  async run() {
    const toRecipients = [];
    for (const address of this.recipients) {
      toRecipients.push({
        emailAddress: {
          address,
        }
      });
    }

    const attachments = [];
    if (this.name && this.mimetype && this.path &&
    this.name.length == this.mimetype.length && this.mimetype.length == this.path.length) {
      for (let i = 0; i < this.name.length; i++) {
        attachments.push({
          '@odata.type': '#microsoft.graph.fileAttachment',
          name: this.name[i],
          contentType: this.mimetype[i],
          contentBytes: encode([...fs.readFileSync(this.path[i], { flag: 'r' }).values()]),
        });
      }
    }
    else {
      console.log("The arrays \"file\", \"mimetype\" and \"path\" must be the same length in order to add attachments");
    }
    
    const data = {
      message: {
        subject: this.subject,
        body: {
          content: this.content,
          contentType: "text",
        },
        toRecipients,
        attachments,
      },
    };

    return await this.microsoftOutlook._makeRequest("POST", "/me/sendMail", data, null);
  },
};
