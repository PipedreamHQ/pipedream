import orimon from "../../orimon.app.mjs";

export default {
  key: "orimon-send-message",
  name: "Send Message to Orimon",
  description: "Sends a direct message to Orimon. [See the documentation](https://orimon.gitbook.io/docs/developer-api/message-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    orimon,
    text: {
      type: "string",
      label: "Message Text",
      description: "The text message you want Orimon to receive.",
    },
  },
  async run({ $ }) {
    const tenantId = this.orimon.$auth.tenant_id;

    const response = await this.orimon.sendMessage({
      $,
      data: {
        type: "message",
        info: {
          psid: `${Date.parse(new Date())}_${tenantId}`,
          sender: "user",
          tenantId: tenantId,
          platformName: "web",
        },
        message: {
          id: tenantId,
          type: "text",
          payload: {
            text: this.text,
          },
        },
      },
    });

    $.export("$summary", "Message sent successfully to Orimon!");
    return response;
  },
};
