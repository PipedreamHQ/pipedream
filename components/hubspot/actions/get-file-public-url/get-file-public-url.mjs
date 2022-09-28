import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-file-public-url",
  name: "Get File Public URL",
  description: "Get a publicly available URL for a file that was uploaded using a Hubspot form. [See the docs here](https://developers.hubspot.com/docs/api/files/files#endpoint?spec=GET-/files/v3/files/{fileId}/signed-url)",
  version: "0.0.2",
  type: "action",
  props: {
    hubspot,
    fileUrl: {
      propDefinition: [
        hubspot,
        "fileUrl",
      ],
    },
    expirationSeconds: {
      type: "integer",
      label: "Public URL Expiration (seconds)",
      description: "The number of seconds the returned public URL will be accessible for. Default is 1 hour (3600 seconds). Maximum is 6 hours (21600 seconds).",
      default: 3600,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      fileUrl,
      expirationSeconds,
    } = this;
    const { results: files } = await this.hubspot.searchFiles({
      url: fileUrl,
    });
    const fileId = files?.[0]?.id;
    if (!fileId) {
      throw new Error(`File not found at ${fileUrl}`);
    }
    // result: { url: string }
    const result = await this.hubspot.getSignedUrl(fileId, {
      expirationSeconds,
    });
    $.export("$summary", "Successfully retrieved a publicly available URL");
    return result;
  },
};
