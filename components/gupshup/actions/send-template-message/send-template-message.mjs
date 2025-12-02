import gupshup from "../../gupshup.app.mjs";

export default {
  key: "gupshup-send-template-message",
  name: "Send Template Message",
  description: "Send a template message. Requires a paid Gupshup account. [See the documentation](https://docs.gupshup.io/reference/sending-text-template)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    gupshup,
    info: {
      type: "alert",
      alertType: "info",
      content: "Note: This action requires a paid Gupshup account.",
    },
    source: {
      type: "string",
      label: "Source",
      description: "Sender Whatsapp Number",
    },
    destination: {
      type: "string",
      label: "Destination",
      description: "Receiver Whatsapp Number",
    },
    templateId: {
      propDefinition: [
        gupshup,
        "templateId",
      ],
    },
    params: {
      type: "string[]",
      label: "Parameters",
      description: "List of template parameters",
    },
  },
  async run({ $ }) {
    const response = await this.gupshup.sendTemplateMessage({
      $,
      data: {
        source: this.source,
        destination: this.destination,
        template: {
          id: this.templateId,
          params: this.params,
        },
      },
    });
    if (response.status === "success") {
      $.export("$summary", `Successfully sent template message to ${this.destination}`);
    }
    return response;
  },
};
