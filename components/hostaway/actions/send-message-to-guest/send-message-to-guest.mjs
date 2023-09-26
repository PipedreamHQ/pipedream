import hostaway from "../../hostaway.app.mjs";

export default {
  key: "hostaway-send-message-to-guest",
  name: "Send Message To Guest",
  description: "Send a conversation message to a guest in Hostaway. [See the documentation](https://api.hostaway.com/documentation#send-conversation-message)",
  version: "0.0.1",
  type: "action",
  props: {
    hostaway,
  },
  async run({ $ }) {
    $.export("summary", "");
  },
};
