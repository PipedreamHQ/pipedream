import app from "../../pdf_co.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "HTML to PDF Converter",
  description: "Convert HTML code snippet into full featured PDF. [See docs here](https://apidocs.pdf.co/25-pdf-from-html-html-to-pdf)",
  key: "pdf_co-html-to-pdf-converter",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    html: {
      type: "string",
      label: "HTML",
      description: "Input raw HTML code to be converted.",
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    expiration: {
      propDefinition: [
        app,
        "expiration",
      ],
    },
    async: {
      propDefinition: [
        app,
        "async",
      ],
    },
    profiles: {
      propDefinition: [
        app,
        "profiles",
      ],
    },
    margins: {
      type: "string",
      label: "Margins",
      description: "set to css style margins like 10px, 5mm, 5in for all sides or 5px 5px 5px 5px (the order of margins is top, right, bottom, left).",
      optional: true,
    },
    paperSize: {
      type: "string",
      label: "Paper Size",
      description: "Custom size can be set in px (pixels), mm or in (inches) with width and height separated by space like this: 200 300, 200px 300px, 200mm 300mm, 20cm 30cm or 6in 8in.",
      options: constants.PAPER_SIZE_OPTS,
      optional: true,
    },
    orientation: {
      type: "string",
      label: "Orientation",
      description: "Set to Portrait or Landscape. Portrait by default.",
      options: constants.ORIENTATION_OPTS,
      optional: true,
    },
    printBackground: {
      type: "boolean",
      label: "Print Background",
      description: "true by default. Set to false to disable printing of background.",
      optional: true,
    },
    mediaType: {
      type: "string",
      label: "Media Type",
      description: "Uses print by default. Set to screen to convert HTML as it appears in a browser or print to convert as it appears for printing or none to set none as mediaType for css styles.",
      options: constants.MEDIA_TYPE_OPTS,
      optional: true,
    },
    doNotWaitFullLoad: {
      type: "boolean",
      label: "Do Not Wait Full Load",
      description: "false by default. Set to true to skip waiting for full load (like full video load etc that may affect the total conversion time).",
      optional: true,
    },
    header: {
      type: "string",
      label: "Header",
      description: "Set to HTML for header to be applied on every page at the header.",
      optional: true,
    },
    footer: {
      type: "string",
      label: "Footer",
      description: "Set to HTML for footer to be applied on every page at the bottom.",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = {
      html: this.html,
      name: this.name,
      expiration: this.expiration,
      async: this.async,
      profiles: this.profiles,
      margins: this.margins,
      paperSize: this.paperSize,
      orientation: this.orientation,
      printBackground: this.printBackground,
      mediaType: this.mediaType,
      DoNotWaitFullLoad: this.doNotWaitFullLoad,
      header: this.header,
      footer: this.footer,
    };
    const response = await this.app.genericRequest(
      $,
      payload,
      "/pdf/convert/from/html",
    );
    $.export("$summary", "Successfully converted HTML to PDF");
    return response;
  },
};
