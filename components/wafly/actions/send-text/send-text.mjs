import app from "../../wafly.app.mjs";
export default {
  key: "wafly-send-text",
  name: "Send Text Message",
  version: "0.0.1",
  type: "action",
  description: "Submit a text message through a connected Wafly instance. A message identifier confirms API acceptance; delivery is tracked separately.",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const result = await this.app.sendText({
      phone: this.phone,
      message: this.message,
    });
    $.export("$summary", "Message accepted by the Wafly API; delivery is a separate status.");
    return result;
  },
};
