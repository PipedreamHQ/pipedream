import ultramsg from "../../ultramsg.app.mjs";
import options from "../../common/options.mjs";

export default {
  name: "Send a Message",
  description: "Send a message to a specified number. [See the docs here](https://docs.ultramsg.com/api/post/messages/chat)",
  key: "ultramsg-send-message",
  version: "0.0.1",
  type: "action",
  props: {
    ultramsg,
    to: {
      propDefinition: [
        ultramsg,
        "to",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "Message content",
    },
    priority: {
      type: "integer",
      label: "priority",
      description: "Priority on internal queue of your message",
      default: 10,
      options: options.priorities,
    },
  },
  async run({ $ }) {
    const {
      to,
      body,
      priority,
    } = this;

    const data = {
      to,
      body,
      priority,
    };
    const res = await this.ultramsg.sendMessage(data, $);
    $.export("$summary", `Message successfully sent to "${to}"`);

    return res;
  },
};
