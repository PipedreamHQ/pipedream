import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-create-artifact",
  name: "Create Artifact",
  description: "Turn Markdown or HTML plus a small branding theme into a branded PDF + PNG and a hosted share page in one call. Returns `pdfUrl`, `pngUrl`, `shareUrl`, and `expiresAt`. [See the documentation](https://rendex.dev/docs/api-reference#post-artifact).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rendex,
    content: {
      type: "string",
      label: "Content",
      description: "The Markdown or HTML body to render into a branded artifact.",
    },
    inputFormat: {
      type: "string",
      label: "Input Format",
      description: "How to interpret `content`: `markdown` is converted to styled HTML; `html` is used as a body fragment.",
      optional: true,
      default: "markdown",
      options: [
        "markdown",
        "html",
      ],
    },
    formats: {
      type: "string[]",
      label: "Formats",
      description: "Which artifact formats to produce. Each format charges 1 credit. Defaults to both.",
      optional: true,
      default: [
        "pdf",
        "png",
      ],
      options: [
        "pdf",
        "png",
      ],
    },
    brandName: {
      type: "string",
      label: "Brand Name",
      description: "Plain-text header line shown beside the logo (maps to `branding.header`).",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title for the hosted share page. Falls back to **Brand Name** when set; both populate `branding.header` (the API's single header field).",
      optional: true,
    },
    accentColor: {
      type: "string",
      label: "Accent Color",
      description: "CSS color for the accent bar, links, and headings (e.g. `#EA580C`, `rebeccapurple`).",
      optional: true,
    },
    logoUrl: {
      type: "string",
      label: "Logo URL",
      description: "Absolute http(s) URL of a logo image shown in the artifact header.",
      optional: true,
    },
    footer: {
      type: "string",
      label: "Footer",
      description: "Plain-text footer line shown at the bottom of every page.",
      optional: true,
    },
    expiresIn: {
      propDefinition: [
        rendex,
        "expiresIn",
      ],
      description: "Seconds until the hosted artifact URLs expire (3600–2592000). Defaults to `86400` (24 hours).",
    },
  },
  async run({ $ }) {
    const branding = {
      logo: this.logoUrl,
      accentColor: this.accentColor,
      header: this.brandName || this.title,
      footer: this.footer,
    };
    const hasBranding = Object.values(branding).some((value) =>
      value !== undefined && value !== "");

    const response = await this.rendex.createArtifact({
      $,
      data: {
        content: this.content,
        inputFormat: this.inputFormat,
        formats: this.formats,
        branding: hasBranding
          ? branding
          : undefined,
        expiresIn: this.expiresIn,
      },
    });

    const data = response.data;
    $.export("$summary", `Created artifact (share ${data?.shareUrl})`);
    return data;
  },
};
