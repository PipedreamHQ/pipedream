import whautomate from "../../whautomate.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "whautomate-send-whatsapp-template-message",
  name: "Send WhatsApp Template Message",
  description: "Send a pre-defined WhatsApp message template to a contact. [See the documentation](https://help.whautomate.com/product-guides/whautomate-rest-api/messages)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    whautomate,
    contactId: {
      propDefinition: [
        whautomate,
        "contactId",
      ],
    },
    templateId: {
      propDefinition: [
        whautomate,
        "templateId",
      ],
    },
    templateVariables: {
      propDefinition: [
        whautomate,
        "templateVariables",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.whautomate.sendWhatsAppMessageTemplate({
      contactId: this.contactId,
      templateId: this.templateId,
      templateVariables: this.templateVariables,
    });

    $.export("$summary", `Successfully sent template message to contact ID ${this.contactId}`);
    return response;
  },
};
