import smugmug from "../../smugmug.app.mjs";
import fs from "fs";
import FormData from "form-data";

export default {
  key: "smugmug-upload-image",
  name: "Upload Image",
  description: "Uploads an image to a SmugMug album. [See the docs here](https://api.smugmug.com/services/api/?method=upload)",
  version: "0.0.1",
  type: "action",
  props: {
    smugmug,
    album: {
      propDefinition: [
        smugmug,
        "album",
      ],
      description: "Album Key of the album where image will be uploaded",
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the image file saved to the [`/tmp`directory](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory)(e.g. `/tmp/image.png`).",
    },
  },
  async run({ $ }) {
    const filename = this.filePath.split("/").pop();

    const album = await this.smugmug.getAlbum(this.album, {
      $,
    });
    const albumUri = album.Response.Uri;

    const data = new FormData();
    const file = fs.createReadStream(this.filePath);
    data.append("file", file);

    const response = await this.smugmug.uploadImage(filename, albumUri, data, $);
    if (response.stat === "ok") {
      $.export("$summary", "Image successfully uploaded");
    } else {
      $.export("$summary", `${response.message}`);
    }
    return response;
  },
};
