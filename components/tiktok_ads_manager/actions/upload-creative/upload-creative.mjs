import crypto from "crypto";
import { Readable } from "stream";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import app from "../../tiktok_ads_manager.app.mjs";

export default {
  key: "tiktok_ads_manager-upload-creative",
  name: "Upload Creative",
  description:
    "Upload an image or video to the TikTok Ads Asset Library and return its asset ID."
    + " Always run this tool before **Create or Update Ad** when using new creative — the ad creation API requires asset IDs, not file URLs."
    + " Provide a publicly accessible URL or a `/tmp` file path."
    + " Returns `image_id` for images and `video_id` for videos."
    + " Supported image formats: JPG, JPEG, PNG. Supported video formats: MP4, MOV, MPEG, AVI."
    + " For images, see [documentation](https://business-api.tiktok.com/portal/docs/upload-an-image-reference/v1.3)."
    + " For videos, see [documentation](https://business-api.tiktok.com/portal/docs/upload-a-video/v1.3).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    advertiserId: {
      propDefinition: [
        app,
        "advertiserId",
      ],
    },
    creativeType: {
      type: "string",
      label: "Creative Type",
      description: "Type of creative asset to upload.",
      options: [
        "IMAGE",
        "VIDEO",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "Publicly accessible URL or `/tmp` file path. For URL upload, TikTok fetches the file directly. For file upload, the file is read from `/tmp`.",
      format: "file-ref",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "Display name for the asset in the Asset Library (max 100 characters). Defaults to the original filename. File names must be unique per advertiser.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const isUrl = this.filePath.startsWith("http://") || this.filePath.startsWith("https://");
    const isImage = this.creativeType === "IMAGE";
    const upload = isImage
      ? this.app.uploadImage.bind(this.app)
      : this.app.uploadVideo.bind(this.app);

    let response;

    if (isUrl) {
      const body = {
        advertiser_id: this.advertiserId,
        upload_type: "UPLOAD_BY_URL",
        file_name: this.fileName,
      };
      if (isImage) {
        body.image_url = this.filePath;
      } else {
        body.video_url = this.filePath;
      }
      response = await upload({
        $,
        data: body,
      });
    } else {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(this.filePath);
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const fileBuffer = Buffer.concat(chunks);
      const signature = crypto.createHash("md5").update(fileBuffer)
        .digest("hex");

      const form = new FormData();
      form.append("advertiser_id", this.advertiserId);
      form.append("upload_type", "UPLOAD_BY_FILE");
      if (this.fileName) form.append("file_name", this.fileName);
      const fieldName = isImage
        ? "image_file"
        : "video_file";
      const signatureField = isImage
        ? "image_signature"
        : "video_signature";
      const fname = this.fileName || metadata.name || (isImage
        ? "image.jpg"
        : "video.mp4");
      form.append(fieldName, Readable.from([
        fileBuffer,
      ]), {
        filename: fname,
        contentType: metadata.contentType || (isImage
          ? "image/jpeg"
          : "video/mp4"),
        knownLength: fileBuffer.length,
      });
      form.append(signatureField, signature);

      response = await upload({
        $,
        data: form,
        headers: form.getHeaders(),
      });
    }

    const imageId = response?.data?.image_id;
    const videoData = Array.isArray(response?.data)
      ? response?.data?.[0]
      : null;
    const assetId = imageId || videoData?.video_id || videoData?.material_id;
    $.export("$summary", `Uploaded ${this.creativeType.toLowerCase()}${assetId
      ? ` (ID: ${assetId})`
      : ""}`);
    return response;
  },
};
