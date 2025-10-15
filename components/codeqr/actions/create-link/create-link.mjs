import codeqr from "../../codeqr.app.mjs";

export default {
  key: "codeqr-create-link",
  name: "Create a CodeQR Link",
  description:
    "Creates a short link in CodeQR using the CodeQR API. [See the documentation](https://codeqr.mintlify.app/api-reference/endpoint/create-a-link)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    codeqr,
    url: {
      type: "string",
      label: "URL",
      description: "The destination URL of the short link.",
    },
    key: {
      type: "string",
      label: "Key",
      description:
        "The short link slug. If not provided, a random 7-character slug will be generated.",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description:
        "The domain of the short link. If not provided, the default workspace domain will be used.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description:
        "This is the ID of the link in your database. Must be prefixed with ext_.",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password required to access the destination URL.",
      optional: true,
    },
    flexible: {
      type: "boolean",
      label: "Flexible Link",
      description:
        "Whether this is a flexible link with dynamic destination setting.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title displayed on the short link page.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description displayed on the short link page.",
      optional: true,
    },
    image: {
      type: "string",
      label: "Image URL",
      description: "URL of the image displayed on the short link page.",
      optional: true,
    },
    video: {
      type: "string",
      label: "Video URL",
      description: "URL of the video displayed on the short link page.",
      optional: true,
    },
    proxy: {
      type: "boolean",
      label: "Proxy",
      description: "Enable proxy settings.",
      optional: true,
    },
    rewrite: {
      type: "boolean",
      label: "Rewrite Link",
      description: "Enable link rewriting.",
      optional: true,
    },
    ios: {
      type: "string",
      label: "iOS URL",
      description: "The iOS destination URL for device-specific redirection.",
      optional: true,
    },
    android: {
      type: "string",
      label: "Android URL",
      description:
        "The Android destination URL for device-specific redirection.",
      optional: true,
    },
    doIndex: {
      type: "boolean",
      label: "Allow Indexing",
      description: "Enable indexing of the short link.",
      optional: true,
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "Comments or notes about the short link.",
      optional: true,
    },
    expiresAt: {
      type: "string",
      label: "Expiration Date",
      description:
        "The date and time when the short link will expire (ISO 8601). E.g. `2025-06-13T05:31:56Z`",
      optional: true,
    },
    expiredUrl: {
      type: "string",
      label: "Expired Redirect URL",
      description: "The URL to redirect to when the short link has expired.",
      optional: true,
    },
    geo: {
      type: "object",
      label: "Geo-Targeting",
      description:
        "Mapping of country codes to destination URLs (JSON format).",
      optional: true,
    },
    publicStats: {
      type: "boolean",
      label: "Public Stats",
      description: "Whether the short link's stats are publicly accessible.",
      optional: true,
    },
  },

  async run({ $ }) {
    const {
      url,
      key,
      domain,
      externalId,
      password,
      flexible,
      title,
      description,
      image,
      video,
      proxy,
      rewrite,
      ios,
      android,
      doIndex,
      comments,
      expiresAt,
      expiredUrl,
      publicStats,
    } = this;

    const geo = typeof this.geo === "string"
      ? JSON.parse(this.geo)
      : this.geo;

    const payload = {
      url,
    };
    key && (payload.key = key);
    domain && (payload.domain = domain);
    externalId && (payload.externalId = externalId);
    password && (payload.password = password);
    flexible != null && (payload.flexible = flexible);
    title && (payload.title = title);
    description && (payload.description = description);
    image && (payload.image = image);
    video && (payload.video = video);
    proxy != null && (payload.proxy = proxy);
    rewrite != null && (payload.rewrite = rewrite);
    ios && (payload.ios = ios);
    android && (payload.android = android);
    doIndex != null && (payload.doIndex = doIndex);
    comments && (payload.comments = comments);
    expiresAt && (payload.expiresAt = expiresAt);
    expiredUrl && (payload.expiredUrl = expiredUrl);
    geo && (payload.geo = geo);
    publicStats != null && (payload.publicStats = publicStats);

    const response = await this.codeqr.createLink({
      $,
      data: payload,
    });
    response && $.export("$summary", "Link created successfully");
    return response;
  },
};
