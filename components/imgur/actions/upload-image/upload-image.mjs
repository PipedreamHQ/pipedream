import imgur from "../../imgur.app.mjs";

export default {
  name: "Upload Image",
  version: "0.1.1",
  key: "imgur-upload-image",
  description: "Upload an image to Imgur",
  props: {
    imgur,
    image: {
      type: "string",
      label: "Image",
      description: "A base 64 encoded image",
    },
  },
  type: "action",
  async run({ $ }) {
    const res = await this.imgur.uploadImage(this.image);

    if (!res.status == 200) {
      $.export("response", res);
      if ($.flow) {
        return $.flow.exit("Failed to upload.");
      } else {
        throw new Error("Failed to upload.");
      }
    }

    return res;
  },
};
