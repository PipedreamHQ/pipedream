import ultramsg from "../../ultramsg.app.mjs";

export default {
  name: "Send an Audio",
  description: "Send an audio to a specified number. [See the docs here](https://docs.ultramsg.com/api/post/messages/audio)",
  key: "ultramsg-send-an-audio",
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
    audio: {
      type: "string",
      label: "Audio",
      description: "Public URL of your audio",
    },
  },
  async run({ $ }) {
    const {
      to,
      audio,
    } = this;

    const data = {
      to,
      audio,
    };
    const res = await this.ultramsg.sendAudio(data, $);
    $.export("$summary", `Audio successfully sent to "${to}"`);

    return res;
  },
};
