import app from "../../leonardo_ai.app.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "leonardo_ai-upload-image",
  name: "Upload Image",
  description: "Uploads a new image to Leonardo AI for use in generations and variations. [See the documentation](https://docs.leonardo.ai/docs/how-to-upload-an-image-using-a-presigned-url)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    extension: {
      type: "string",
      label: "File Extension",
      description: "The file extension of the image to upload.",
      options: [
        {
          label: "PNG",
          value: "png",
        },
        {
          label: "JPG",
          value: "jpg",
        },
        {
          label: "JPEG",
          value: "jpeg",
        },
        {
          label: "WebP",
          value: "webp",
        },
      ],
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myImage.png`)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      extension,
      filePath,
    } = this;
    // Get file stream from URL or /tmp based path
    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(filePath);

    // Step 1: Get the presigned URL, upload fields appended to formData
    const uploadResponse = await this.app.getUploadInitImage({
      $,
      extension,
    });

    const { uploadInitImage } = uploadResponse;
    const fields = JSON.parse(uploadInitImage.fields);
    const formData = new FormData();

    //Important: Order of fields is sanctioned by Leonardo AI API. Fields go first, then the file
    for (const [
      label,
      value,
    ] of Object.entries(fields)) {
      formData.append(label, value.toString());
    }
    formData.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
    const uploadUrl = uploadInitImage.url;

    // Step 2: Upload the file to the presigned URL
    const uploadResult = await this.app.uploadFileToPresignedUrl({
      $,
      url: uploadUrl,
      formData,
    });

    $.export("$summary", `Successfully uploaded image: ${metadata.name || filePath}`);
    return {
      uploadInitImage,
      uploadResult,
    };
  },
};
