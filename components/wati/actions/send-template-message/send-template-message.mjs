import { ConfigurationError } from "@pipedream/platform";
import wati from "../../wati.app.mjs";

export default {
  key: "wati-send-template-message",
  name: "Send WhatsApp Template Message",
  description: "Enables sending of WhatsApp messages using a pre-approved template. [See the documentation](https://docs.wati.io/reference/post_api-v2-sendtemplatemessage)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wati,
    whatsappNumber: {
      propDefinition: [
        wati,
        "whatsappNumber",
      ],
    },
    customParams: {
      propDefinition: [
        wati,
        "customParams",
      ],
      label: "Parameters",
      description: "An object with template's custom params.",
    },
    templateName: {
      propDefinition: [
        wati,
        "templateName",
      ],
    },
    broadcastName: {
      type: "string",
      label: "Broadcast Name",
      description: "The name of broadcast.",
    },
  },
  async run({ $ }) {
    const response = await this.wati.sendTemplateMessage({
      $,
      params: {
        whatsappNumber: this.whatsappNumber,
      },
      data: {
        parameters: this.customParams && Object.entries(this.customParams).map(([
          key,
          value,
        ]) => ({
          name: key,
          value,
        })),
        template_name: this.templateName,
        broadcast_name: this.broadcastName,
      },
    });
    if (!response.result) {
      throw new ConfigurationError(response.info);
    }

    $.export("$summary", `Successfully sent template message to ${this.whatsappNumber}`);
    return response;
  },
};
