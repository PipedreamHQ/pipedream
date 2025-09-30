import botconversa from "../../botconversa.app.mjs";

export default {
  key: "botconversa-send-message",
  name: "Send Message",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Send a message to a specific subscriber. [See the documentation](https://backend.botconversa.com.br/swagger/)",
  type: "action",
  props: {
    botconversa,
    subscriberId: {
      propDefinition: [
        botconversa,
        "subscriberId",
      ],
      withLabel: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the message",
      options: [
        "text",
        "file",
      ],
    },
    value: {
      type: "string",
      label: "Message",
      description: "The message can be a text, float or link to image or file.",
    },
  },
  async run({ $ }) {
    const {
      botconversa,
      subscriberId,
      type,
      value,
    } = this;

    const response = await botconversa.sendMessage({
      $,
      subscriberId: subscriberId.value,
      data: {
        type,
        value,
      },
    });

    $.export("$summary", `The message was successfully sent to subscriber ${subscriberId.label}!`);
    return response;
  },
};
