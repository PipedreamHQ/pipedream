import icontact from "../../icontact.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "icontact-create-message",
  name: "Create and Dispatch Message",
  description: "Creates and dispatches a new message using custom HTML. [See the documentation](https://help.icontact.com/customers/s/article/messages-icontact-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    icontact,
    recipientEmail: {
      propDefinition: [
        icontact,
        "recipientEmail",
      ],
    },
    senderEmail: {
      propDefinition: [
        icontact,
        "senderEmail",
      ],
    },
    htmlContent: {
      propDefinition: [
        icontact,
        "htmlContent",
      ],
    },
    subject: {
      propDefinition: [
        icontact,
        "subject",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.icontact.createAndSendMessage({
      recipientEmail: this.recipientEmail,
      senderEmail: this.senderEmail,
      htmlContent: this.htmlContent,
      subject: this.subject,
    });

    $.export("$summary", `Message sent successfully to ${this.recipientEmail}`);
    return response;
  },
};
