import ultramsg from "../../ultramsg.app.mjs";

export default {
  name: "Send Audio",
  description: "Send an audio file to a specified number. [See the docs here](https://docs.ultramsg.com/api/post/messages/audio)",
  key: "ultramsg-send-audio",
  version: "0.0.2",
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
      description: "Public URL of your audio file",
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
