import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import whautomate from "../../whautomate.app.mjs";

export default {
  key: "whautomate-send-whatsapp-template-message",
  name: "Send WhatsApp Template Message",
  description: "Send a pre-defined WhatsApp message template to a contact. [See the documentation](https://help.whautomate.com/product-guides/whautomate-rest-api/messages)",
  version: "0.0.1",
  type: "action",
  props: {
    whautomate,
    contactId: {
      propDefinition: [
        whautomate,
        "contactId",
      ],
    },
    templateName: {
      type: "string",
      label: "Template Name",
      description: "The WhatsApp Template from your Whautomate Account.",
    },
    templateLanguage: {
      type: "string",
      label: "Template Language",
      description: "The language of the WhatsApp Template.",
    },
    locationId: {
      propDefinition: [
        whautomate,
        "locationId",
      ],
    },
    headerMediaUrl: {
      type: "string",
      label: "Header Media URL",
      description: "The URL of the header media.",
      optional: true,
    },
    headerTextParameters: {
      type: "string[]",
      label: "Header Text Parameters",
      description: "The variables used in the header of your WhatsApp Template.",
      optional: true,
    },
    bodyTextParameters: {
      type: "string[]",
      label: "Body Text Parameters",
      description: "The variables used in the body of your WhatsApp Template.",
      optional: true,
    },
    buttonUrlParameters: {
      type: "string[]",
      label: "Button URL Parameters",
      description: "The placeholders used in the buttons of your WhatsApp Template.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.whautomate.sendWhatsAppMessageTemplate({
      $,
      data: {
        contact: {
          id: this.contactId,
        },
        template: {
          name: this.templateName,
          language: this.templateLanguage,
        },
        location: {
          id: this.locationId,
        },
        headerMediaUrl: this.headerMediaUrl,
        headerTextParameters: parseObject(this.headerTextParameters),
        bodyTextParameters: parseObject(this.bodyTextParameters),
        buttonUrlParameters: parseObject(this.buttonUrlParameters),
      },
    });

    if (response.error) throw new ConfigurationError(response.error);

    $.export("$summary", `Successfully sent template message to ${this.locationId}`);
    return response;
  },
};
