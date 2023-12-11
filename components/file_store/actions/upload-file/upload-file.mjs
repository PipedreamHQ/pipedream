import fileStore from "../../file_store.app.mjs";

export default {
  key: "file_store-upload-file",
  name: "Upload File",
  description: "Uploads a file to the File Store. [See the documentation](https://pipedream.com/docs/projects/file-stores/reference/)",
  version: "0.0.1",
  type: "action",
  props: {
    fileStore,
    directory: {
      propDefinition: [
        fileStore,
        "directory",
      ],
    },
    file: {
      propDefinition: [
        fileStore,
        "file",
        (c) => ({
          directory: c.directory,
        }),
      ],
    },
    localFilePath: {
      type: "string",
      label: "Local File Path",
      description: "The local path of the file to upload. Only `/tmp` is writable in workflow environments.",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The content type of the file (e.g., `image/png`).",
      optional: true,
    },
    contentLength: {
      type: "integer",
      label: "Content Length",
      description: "The content length of the file in bytes. Pass this if possible to avoid writing the entire file to `/tmp` before uploading.",
      optional: true,
    },
    url: {
      type: "string",
      label: "File URL",
      description: "The URL to read the file from. Use this if you want to upload a file from a URL.",
      optional: true,
    },
  },
  async run({ $ }) {
    let fileUrl;

    // Check if a URL is provided and use the fromUrl method
    if (this.url) {
      fileUrl = await this.fileStore.uploadFileFromUrl({
        url: this.url,
        fileName: this.file,
      });
    } else if (this.localFilePath) {
      // If localFilePath is provided, upload the file from the local /tmp directory
      if (this.contentLength) {
        // If contentLength is provided, create a write stream
        const writeStream = await this.fileStore.createWriteStream({
          fileName: this.file,
          contentType: this.contentType,
          contentLength: this.contentLength,
        });
        fileUrl = writeStream.url;
      } else {
        // Otherwise, use the fromFile method
        fileUrl = await this.fileStore.uploadFileFromPath({
          localFilePath: this.localFilePath,
          fileName: this.file,
          contentType: this.contentType,
        });
      }
    } else {
      throw new Error("You must provide either a Local File Path or a File URL.");
    }

    $.export("$summary", `Uploaded file successfully: ${fileUrl}`);
    return fileUrl;
  },
};
