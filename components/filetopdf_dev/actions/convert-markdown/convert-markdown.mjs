import app from "../../filetopdf_dev.app.mjs";

export default {
  key: "filetopdf_dev-convert-markdown",
  name: "Convert Markdown to PDF",
  description: "Render Markdown (with optional CSS) into a clean PDF. [See the documentation](https://filetopdf.dev/markdown).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    markdown: {
      type: "string",
      label: "Markdown",
      description: "The Markdown content to render. A sensible default stylesheet is applied when no CSS is provided.",
    },
    css: {
      type: "string",
      label: "CSS",
      description: "Optional CSS to style the rendered Markdown. Overrides the default stylesheet. Use `@page` rules for page size/margins, or set them in the options below.",
      optional: true,
    },
    // Chromium layout options (advanced). Require Pro/Scale/free trial.
    landscape: { propDefinition: [app, "landscape"] },
    paperWidth: { propDefinition: [app, "paperWidth"] },
    paperHeight: { propDefinition: [app, "paperHeight"] },
    marginTop: { propDefinition: [app, "marginTop"] },
    marginBottom: { propDefinition: [app, "marginBottom"] },
    marginLeft: { propDefinition: [app, "marginLeft"] },
    marginRight: { propDefinition: [app, "marginRight"] },
    scale: { propDefinition: [app, "scale"] },
    printBackground: { propDefinition: [app, "printBackground"] },
    preferCssPageSize: { propDefinition: [app, "preferCssPageSize"] },
    nativePageRanges: { propDefinition: [app, "nativePageRanges"] },
    pdfa: { propDefinition: [app, "pdfa"] },
    pdfua: { propDefinition: [app, "pdfua"] },
    userPassword: { propDefinition: [app, "userPassword"] },
    ownerPassword: { propDefinition: [app, "ownerPassword"] },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const options = this.app.stringifyOptions({
      landscape: this.landscape,
      paperWidth: this.paperWidth,
      paperHeight: this.paperHeight,
      marginTop: this.marginTop,
      marginBottom: this.marginBottom,
      marginLeft: this.marginLeft,
      marginRight: this.marginRight,
      scale: this.scale,
      printBackground: this.printBackground,
      preferCssPageSize: this.preferCssPageSize,
      nativePageRanges: this.nativePageRanges,
      pdfa: this.pdfa,
      pdfua: this.pdfua,
      userPassword: this.userPassword,
      ownerPassword: this.ownerPassword,
    });

    const body = {
      markdown: this.markdown,
      ...options,
    };
    if (this.css) body.css = this.css;

    const envelope = await this.app.convertJson($, "/markdown", body);
    const out = await this.app.writePdfToTmp(envelope);
    $.export("$summary", `Converted Markdown to PDF — ${out.pages} page(s), ${out.creditsRemaining} credits left`);
    return out;
  },
};
