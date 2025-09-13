import app from "../../leonardo_ai.app.mjs";

export default {
  key: "leonardo_ai-upload-image",
  name: "Upload Image",
  description: "Uploads a new image to Leonardo AI for use in generations and variations.",
  version: "0.0.9",
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
    file: {
      type: "string",
      label: "File",
      description: "The base64 encoded image file to upload.",
    },
  },
  async run({ $ }) {
    const {
      extension,
      file,
    } = this;
    console.log(extension);
    // Convert base64 string to Buffer
    const base64Data = file.replace(/^data:image\/[a-z]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Create a File-like object from the buffer
    const fileObject = {
      buffer: buffer,
      name: `image.${extension}`,
      type: `image/${
        extension === "jpg" ?
          "jpeg"
          : extension
      }`,
    };

    // Step 1: Get the presigned URL and upload fields
    const uploadResponse = await this.app.getUploadInitImage({
      $,
      extension,
    });

    const { uploadInitImage } = uploadResponse;
    const fields = JSON.parse(uploadInitImage.fields);
    const uploadUrl = uploadInitImage.url;

    // Step 2: Upload the file to the presigned URL
    const uploadResult = await this.app.uploadFileToPresignedUrl({
      $,
      url: uploadUrl,
      fields,
      file: fileObject,
    });

    $.export("$summary", `Successfully uploaded image with extension: ${extension}`);
    return {
      uploadInitImage,
      uploadResult,
    };
  },
};
