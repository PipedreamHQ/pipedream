import app from "../../google_photos.app.mjs";
import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";

export default {
  key: "google_photos-upload-item",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Upload Item",
  description: "Uploads an item to Google Photos. [See the documentation](https://developers.google.com/photos/library/guides/upload-media)",
  props: {
    app,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The media content to upload. Provide a file URL or a path to a file in the `/tmp` directory.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description.",
      optional: true,
    },
    albumId: {
      propDefinition: [
        app,
        "albumId",
      ],
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    streamToUint8Array(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          resolve(new Uint8Array(buffer));
        });
        stream.on("error", reject);
      });
    },
  },
  async run ({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);
    if (!metadata.contentType) {
      throw new ConfigurationError("Can't determine content type of the file. Please specify it in the source step.");
    }

    const bytes = await this.streamToUint8Array(stream);
    const uploadToken = await this.app.uploadBytes({
      $,
      headers: {
        "Content-type": "application/octet-stream",
        "X-Goog-Upload-Content-Type": metadata.contentType,
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
              fileName: metadata.name,
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
