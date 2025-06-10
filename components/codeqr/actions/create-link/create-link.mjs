import codeqr from "../../codeqr.app.mjs";

export default {
  key: "codeqr-create-link",
  name: "Create a CodeQR Link",
  description:
    "Creates a short link in CodeQR using the CodeQR API. [See the docs here](https://codeqr.mintlify.app/api-reference/endpoint/create-a-link)",
  version: "0.0.1",
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
    preRedirection: {
      type: "boolean",
      label: "Pre-Redirection Page",
      description:
        "Enable a pre-redirection page before sending users to the destination URL.",
      optional: true,
    },
    pageId: {
      type: "string",
      label: "Page ID",
      description: "ID of your page created in CodeQR.",
      optional: true,
    },
    pageUrl: {
      type: "string",
      label: "Page URL",
      description: "The URL for the pre-redirect page.",
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
        "The date and time when the short link will expire (ISO 8601).",
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
    tagIds: {
      type: "string[]",
      label: "Tag IDs",
      description: "Array of tag IDs to apply to the short link.",
      optional: true,
    },
    tagNames: {
      type: "string[]",
      label: "Tag Names",
      description: "Array of tag names to apply to the short link.",
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
      preRedirection,
      pageId,
      pageUrl,
      rewrite,
      ios,
      android,
      doIndex,
      comments,
      expiresAt,
      expiredUrl,
      geo,
      publicStats,
      tagIds,
      tagNames,
    } = this;

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
    preRedirection != null && (payload.preRedirection = preRedirection);
    pageId && (payload.pageId = pageId);
    pageUrl && (payload.pageUrl = pageUrl);
    rewrite != null && (payload.rewrite = rewrite);
    ios && (payload.ios = ios);
    android && (payload.android = android);
    doIndex != null && (payload.doIndex = doIndex);
    comments && (payload.comments = comments);
    expiresAt && (payload.expiresAt = expiresAt);
    expiredUrl && (payload.expiredUrl = expiredUrl);
    geo && (payload.geo = geo);
    publicStats != null && (payload.publicStats = publicStats);

    if (tagIds?.length) payload.tagIds = tagIds;
    if (tagNames?.length) payload.tagNames = tagNames;

    const response = await this.codeqr.createLink(payload);
    response && $.export("$summary", "Link created successfully");
    return response;
  },
};
