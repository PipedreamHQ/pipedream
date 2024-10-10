import wati from "../../wati.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "wati-send-template-message",
  name: "Send WhatsApp Template Message",
  description: "Enables sending of WhatsApp messages using a pre-approved template. [See the documentation](https://docs.wati.io/reference/post_api-v2-sendtemplatemessage)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    wati,
    contactDetails: {
      propDefinition: [
        wati,
        "contactDetails",
      ],
    },
    templateDetails: {
      propDefinition: [
        wati,
        "templateDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wati.sendTemplateMessage({
      contactDetails: this.contactDetails,
      templateDetails: this.templateDetails,
    });

    $.export("$summary", `Successfully sent template message to ${this.contactDetails.name || this.contactDetails.number}`);
    return response;
  },
};
