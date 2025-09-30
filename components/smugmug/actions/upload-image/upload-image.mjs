import smugmug from "../../smugmug.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "smugmug-upload-image",
  name: "Upload Image",
  description: "Uploads an image to a SmugMug album. [See the docs here](https://api.smugmug.com/services/api/?method=upload)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`).",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const filename = this.filePath.split("/").pop();

    const album = await this.smugmug.getAlbum(this.album, {
      $,
    });
    const albumUri = album.Response.Uri;

    const data = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.smugmug.uploadImage(filename, albumUri, data, $);
    if (response.stat === "ok") {
      $.export("$summary", "Image successfully uploaded");
    } else {
      $.export("$summary", `${response.message}`);
    }
    return response;
  },
};
