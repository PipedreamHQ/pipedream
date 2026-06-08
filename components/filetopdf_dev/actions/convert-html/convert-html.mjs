import app from "../../filetopdf_dev.app.mjs";

export default {
  key: "filetopdf_dev-convert-html",
  name: "Convert HTML to PDF",
  description: "Render HTML + CSS into a pixel-perfect PDF. [See the documentation](https://filetopdf.dev/html).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    html: {
      type: "string",
      label: "HTML",
      description: "The HTML markup to render. A full `<html>` document or just a snippet (a `<div>`, a few tags…) both work — we wrap a snippet for you. Images, fonts and stylesheets load if you link them by full URL.",
    },
    css: {
      type: "string",
      label: "CSS",
      description: "Optional CSS injected into the document's `<head>`. Use `@page` rules for page size/margins, or set them in the options below. Have an `.html` file or a link instead? Use **Convert a File to PDF**.",
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
      html: this.html,
      ...options,
    };
    if (this.css) body.css = this.css;

    const envelope = await this.app.convertJson($, "/html", body);
    const out = await this.app.writePdfToTmp(envelope);
    $.export("$summary", `Converted HTML to PDF — ${out.pages} page(s), ${out.creditsRemaining} credits left`);
    return out;
  },
};
