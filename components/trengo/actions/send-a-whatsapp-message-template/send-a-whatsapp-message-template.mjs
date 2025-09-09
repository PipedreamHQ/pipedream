import { ConfigurationError } from "@pipedream/platform";
import app from "../../trengo.app.mjs";

export default {
  type: "action",
  key: "trengo-send-a-whatsapp-message-template",
  version: "0.0.4",
  name: "Send A WhatsApp Message Template",
  description: "Sends a WhatsApp message template, [See the documentation](https://developers.trengo.com/reference/start-a-conversation)",
  props: {
    app,
    recepientPhoneNumber: {
      propDefinition: [
        app,
        "recepientPhoneNumber",
      ],
      description: "Only required if `Ticket ID` is not set. Should be a valid phone number.",
      optional: true,
    },
    ticketId: {
      propDefinition: [
        app,
        "ticketId",
      ],
      optional: true,
    },
    hsmId: {
      propDefinition: [
        app,
        "hsmId",
      ],
    },
    whatsappTemplateParamsKeys: {
      propDefinition: [
        app,
        "whatsappTemplateParamsKeys",
      ],
    },
    whatsappTemplateParamsValues: {
      propDefinition: [
        app,
        "whatsappTemplateParamsValues",
      ],
    },
  },
  async run ({ $ }) {
    if (!this.recepientPhoneNumber && !this.ticketId) {
      throw new ConfigurationError("Either `Recipient Phone Number` or `Ticket ID` should be set!");
    }
    const params = [];
    if (this.whatsappTemplateParamsKeys && this.whatsappTemplateParamsValues) {
      if (this.whatsappTemplateParamsKeys.length != this.whatsappTemplateParamsValues.length) {
        throw new ConfigurationError("Message param keys and values should have the same amount of items!");
      } else {
        for (let i = 0; i < this.whatsappTemplateParamsKeys.length; i++) {
          params.push({
            key: this.whatsappTemplateParamsKeys[i],
            value: this.whatsappTemplateParamsValues[i],
          });
        }
      }
    }
    const resp = await this.app.sendWhatsappMessageTemplate({
      $,
      data: {
        recipient_phone_number: this.recepientPhoneNumber,
        hsm_id: this.hsmId,
        // the docs specify this as string for some reason
        ticket_id: this.ticketId?.toString?.() || this.ticketId,
        params,
      },
    });
    $.export("$summary", `The contact has been created. (${resp.name} ID:${resp.id})`);
    return resp;
  },
};
