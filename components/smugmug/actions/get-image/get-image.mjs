import smugmug from "../../smugmug.app.mjs";

export default {
  key: "smugmug-get-image",
  name: "Get Image",
  description: "Gets an image. An image is a photo or video stored on SmugMug. [See the docs here](https://api.smugmug.com/api/v2/doc/reference/image.html)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    smugmug,
    album: {
      propDefinition: [
        smugmug,
        "album",
      ],
      description: "Album Key of the album containing the image",
    },
    image: {
      propDefinition: [
        smugmug,
        "image",
        (c) => ({
          albumKey: c.album,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smugmug.getImage(this.album, this.image, {
      $,
    });
    if (response) {
      $.export("$summary", `Retrieved image with key ${this.image}`);
    }
    return response;
  },
};
