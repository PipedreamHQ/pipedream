import autobound from "../../autobound.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "autobound-write-hyper-personalized-content",
  name: "Write Hyper Personalized Content",
  description: "Compose a personalized message from one person to another",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    autobound,
    sender: {
      propDefinition: [
        autobound,
        "sender",
      ],
    },
    receiver: {
      propDefinition: [
        autobound,
        "receiver",
      ],
    },
    message: {
      propDefinition: [
        autobound,
        "message",
      ],
    },
    context: {
      propDefinition: [
        autobound,
        "context",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.autobound.composeMessage({
      sender: this.sender,
      receiver: this.receiver,
      message: this.message,
      context: this.context,
    });
    $.export("$summary", "Successfully composed personalized message");
    return response;
  },
};
