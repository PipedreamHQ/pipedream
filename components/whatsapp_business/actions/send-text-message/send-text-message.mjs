import whatsapp from "../../whatsapp_business.app.mjs";

export default {
  key: "whatsapp_business-send-text-message",
  name: "Send Text Message",
  description: "Sends a text message",
  version: "0.0.1",
  type: "action",
  props: {
    whatsapp,
  },
  async run({ $ }) {
    $.export("$summary", "Success!");
  },
};
