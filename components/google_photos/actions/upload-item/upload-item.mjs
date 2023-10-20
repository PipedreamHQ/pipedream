import app from "../../google_photos.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";
import mime from "mime-types";
import fs from "fs";

export default {
  key: "google_photos-upload-item",
  version: "0.0.1",
  type: "action",
  name: "Upload Item",
  description: "Uploads an item to Google Photos. [See the documentation](https://developers.google.com/photos/library/guides/upload-media)",
  props: {
    app,
    media: {
      type: "string",
      label: "Media Path",
      description: "The media content to upload, please provide an image file from `/tmp`. To upload a file to `/tmp` folder, please follow the doc [here](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    filename: {
      type: "string",
      label: "File Name",
      description: "File name attribute.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description.",
    },
    albumId: {
      propDefinition: [
        app,
        "albumId",
      ],
      optional: true,
    },
  },
  async run ({ $ }) {
    const filePath = utils.isValidFile(this.media);
    if (!filePath) {
      throw new ConfigurationError("`Media Path` must be a valid file path");
    }
    const fileData = fs.readFileSync(filePath, {
      flag: "r",
    });
    const bytes = new Uint8Array(fileData);
    const uploadToken = await this.app.uploadBytes({
      $,
      headers: {
        "Content-type": "application/octet-stream",
        "X-Goog-Upload-Content-Type": mime.lookup(filePath),
        "X-Goog-Upload-Protocol": "raw",
      },
      data: bytes,
    });
    const resp = await this.app.createItem({
      $,
      data: {
        albumId: this.albumId,
        newMediaItems: [
          {
            description: this.description,
            simpleMediaItem: {
              fileName: this.filename,
              uploadToken,
            },
          },
        ],
      },
    });
    $.export("$summary", "Item has been uploaded successfully.");
    return resp;
  },
};
