import ultramsg from "../../ultramsg.app.mjs";

export default {
  name: "Send an Image",
  description: "Send an image to a specified number. [See the docs here](https://docs.ultramsg.com/api/post/messages/image)",
  key: "ultramsg-send-image",
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
    image: {
      type: "string",
      label: "Image",
      description: "Public URL of your image",
    },
    caption: {
      type: "string",
      label: "Caption",
      description: "Image Caption",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      to,
      image,
      caption,
    } = this;

    const data = {
      to,
      image,
      caption: caption || "",
    };
    const res = await this.ultramsg.sendImage(data, $);
    $.export("$summary", `Image successfully sent to "${to}"`);

    return res;
  },
};
