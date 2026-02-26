import jo4 from "../../jo4.app.mjs";

export default {
  key: "jo4-create-short-url",
  name: "Create Short URL",
  description: "Create a new shortened URL. [See the documentation](https://jo4.io/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    jo4,
    longUrl: {
      type: "string",
      label: "Destination URL",
      description: "The long URL to shorten",
    },
    shortUrl: {
      type: "string",
      label: "Custom Alias",
      description: "Custom short URL alias (e.g., `my-link`). Leave empty for auto-generated.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "A title for the short URL",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to categorize the URL",
      optional: true,
    },
    expirationTime: {
      type: "integer",
      label: "Expiration Time",
      description: "Unix timestamp (milliseconds) when the URL should expire",
      optional: true,
    },
    passwordProtected: {
      type: "boolean",
      label: "Password Protected",
      description: "Whether the URL requires a password to access",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password for the URL (required if password protected is enabled)",
      optional: true,
      secret: true,
    },
    utmSource: {
      type: "string",
      label: "UTM Source",
      description: "UTM source parameter to append",
      optional: true,
    },
    utmMedium: {
      type: "string",
      label: "UTM Medium",
      description: "UTM medium parameter to append",
      optional: true,
    },
    utmCampaign: {
      type: "string",
      label: "UTM Campaign",
      description: "UTM campaign parameter to append",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      longUrl: this.longUrl,
    };

    if (this.shortUrl) data.shortUrl = this.shortUrl;
    if (this.title) data.title = this.title;
    if (this.tags) data.tags = this.tags;
    if (this.expirationTime != null) data.expirationTime = this.expirationTime;
    if (this.passwordProtected) {
      if (!this.password) {
        throw new Error("Password is required when Password Protected is enabled.");
      }
      data.passwordProtected = true;
      data.password = this.password;
    }
    if (this.utmSource) data.utmSource = this.utmSource;
    if (this.utmMedium) data.utmMedium = this.utmMedium;
    if (this.utmCampaign) data.utmCampaign = this.utmCampaign;

    const response = await this.jo4.createUrl({
      data,
      $,
    });

    $.export("$summary", `Created short URL: ${response.fullShortUrl || response.shortUrl || "successfully"}`);
    return response;
  },
};
