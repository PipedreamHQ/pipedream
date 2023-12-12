import ultramsg from "../../ultramsg.app.mjs";

export default {
  name: "Send a Video",
  description: "Send a video to a specified number. [See the docs here](https://docs.ultramsg.com/api/post/messages/video)",
  key: "ultramsg-send-video",
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
    video: {
      type: "string",
      label: "Video",
      description: "Public URL of your video",
    },
  },
  async run({ $ }) {
    const {
      to,
      video,
    } = this;

    const data = {
      to,
      video,
    };
    const res = await this.ultramsg.sendVideo(data, $);
    $.export("$summary", `Video successfully sent to "${to}"`);

    return res;
  },
};
