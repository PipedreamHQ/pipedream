import smugmug from "../../smugmug.app.mjs";

export default {
  key: "smugmug-get-album",
  name: "Get Album",
  description: "Gets an album given its id. [See the docs here](https://api.smugmug.com/api/v2/doc/reference/album.html)",
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
    },
  },
  async run({ $ }) {
    const response = await this.smugmug.getAlbum(this.album, {
      $,
    });
    if (response) {
      $.export("$summary", `Retrieved album with key ${this.album}`);
    }
    return response;
  },
};
