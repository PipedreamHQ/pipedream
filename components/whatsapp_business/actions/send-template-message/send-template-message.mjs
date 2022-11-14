import whatsapp from "../../whatsapp_business.app.mjs";

export default {
  key: "whatsapp_business-send-template-message",
  name: "Send Template Message",
  description: "Sends a template message",
  version: "0.0.1",
  type: "action",
  props: {
    whatsapp,
  },
  async run({ $ }) {
    $.export("$summary", "Success!");
  },
};
