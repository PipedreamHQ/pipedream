import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-upload-media",
  name: "Create Media Upload URL",
  description: "Create a direct-upload URL for Cloudflare Images. Upload a file to the returned `uploadURL`, then use the **Register Uploaded Image** action with the returned `cloudflareImageId` to add it to your media library. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    contentRabbitApp,
    requireSigned: {
      type: "boolean",
      label: "Require Signed URLs",
      description: "Whether image delivery requires signed URLs.",
      default: true,
      optional: true,
    },
    expirySeconds: {
      type: "integer",
      label: "Expiry (seconds)",
      description: "Lifetime of the upload URL in seconds (60-3600).",
      default: 600,
      min: 60,
      max: 3600,
      optional: true,
    },
  },
  async run({ $ }) {
    const uploadUrlResponse = await this.contentRabbitApp.createUploadUrl({
      $,
      data: {
        requireSigned: this.requireSigned,
        expirySeconds: this.expirySeconds,
      },
    });

    const {
      uploadURL, id: cloudflareImageId,
    } = uploadUrlResponse.data ?? {};

    if (!uploadURL || !cloudflareImageId) {
      throw new Error("Failed to create upload URL");
    }

    $.export("$summary", `Created upload URL "${cloudflareImageId}"`);

    return {
      uploadURL,
      cloudflareImageId,
    };
  },
};
