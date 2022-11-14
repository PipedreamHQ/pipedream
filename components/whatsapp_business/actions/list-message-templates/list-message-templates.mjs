import whatsapp from "../../whatsapp_business.app.mjs";

export default {
  key: "whatsapp_business-list-message-templates",
  name: "List Message Templates",
  description: "Lists message templates",
  version: "0.0.1",
  type: "action",
  props: {
    whatsapp,
  },
  async run({ $ }) {
    $.export("$summary", "Success!");
  },
};
