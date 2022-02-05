import microsoft_outlook from "../../microsoft_outlook.app.mjs";
import fs from "fs";
import { encode } from "js-base64";

export default {
  name: "Send email",
  description: "Send an email to one or multiple recipients",
  key: "microsoft_outlook-send_email",
  version: "0.0.1",
  type: "action",
  props: {
    microsoft_outlook,
    recipients: {
      propDefinition: [
        microsoft_outlook,
        "recipients",
      ],
    },
    subject: {
      propDefinition: [
        microsoft_outlook,
        "subject",
      ],
    },
    content: {
      propDefinition: [
        microsoft_outlook,
        "content",
      ],
    },
    /*files: {	//FIXME Temporary commented until object arrays are supported
      propDefinition: [
        microsoft_outlook,
        "files",
      ],
    },*/
    name: {	//FIXME Temporary until object arrays are supported
      propDefinition: [
        microsoft_outlook,
        "name",
      ],
    },
    mimetype: {	//FIXME Temporary until object arrays are supported
      propDefinition: [
        microsoft_outlook,
        "mimetype",
      ],
    },
    path: {	//FIXME Temporary until object arrays are supported
      propDefinition: [
        microsoft_outlook,
        "path",
      ],
    },
  },
  async run() {
    var toRecipients = [];
    for (const recipient of this.recipients) {
      toRecipients.push({
        "emailAddress": {
          "address": recipient
        }
      });
    }

    var attachments = [];
    /*if (this.files) {	//FIXME Temporary commented until object arrays are supported
      for (const file of this.files) {
        attachments.push({
          '@odata.type': '#microsoft.graph.fileAttachment',
          name: file.name,
          contentType: file.mimetype,
          contentBytes: this.readFile(file.path),
        });
      }
    }*/
    if (this.name && this.mimetype && this.path &&	//FIXME Temporary until object arrays are supported
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
        "body": {
          "content": this.content,
          "contentType": "text",
        },
        toRecipients,
        attachments,
      },
    };

    return await this.microsoft_outlook._makeRequest("POST", "/me/sendMail", data, null);
  },
};
