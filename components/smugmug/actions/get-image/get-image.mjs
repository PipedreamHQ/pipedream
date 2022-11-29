import smugmug from "../../smugmug.app.mjs";

export default {
  key: "smugmug-get-image",
  name: "Get Image",
  description: "Gets an image. An image is a photo or video stored on SmugMug. [See the docs here](https://api.smugmug.com/api/v2/doc/reference/image.html)",
  //version: "0.1.2",
  version: "0.1.5",
  type: "action",
  props: {
    smugmug,
    image: {
      propDefinition: [
        smugmug,
        "image",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smugmug.getImage(this.image, {
      $,
    });
    if (response) {
      $.export("$summary", `Retrieved image with key ${this.image}`);
    }
    return response;
  },
};
