import app from "../../pdf_co.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Anything to PDF Converter",
  description: "Convert CSV, XLS, XLSX, DOC, DOCX, RTF, TXT, XPS, JPG, PNG, TIFF, URL, HTML, EMAIL to PDF. [See docs here](https://apidocs.pdf.co/22-pdf-from-csv-csv-to-pdf)",
  key: "pdf_co-anything-to-pdf-converter",
  version: "0.0.10",
  type: "action",
  props: {
    app,
    source: {
      type: "string",
      label: "Source",
      description: "Set the URL of the source file or the raw HTML depending on the Source Type. Supports links from Google Drive, Dropbox and from built-in PDF.co files storage.",
    },
    sourceType: {
      type: "string",
      label: "Source Type",
      description: "Select the type of the source file.",
      options: constants.ANYTHING_TO_PDF_SOURCE_TYPES,
      reloadProps: true,
    },
    httpusername: {
      propDefinition: [
        app,
        "httpusername",
      ],
    },
    httppassword: {
      propDefinition: [
        app,
        "httppassword",
      ],
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
  },
  async additionalProps() {
    if (!this.sourceType) {
      return {};
    }
    let additionalProps = {};
    if (this.sourceType === "URL" || this.sourceType === "HTML" || this.sourceType === "EMAIL") {
      additionalProps = {
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
      };
      if (this.sourceType === "URL" || this.sourceType === "HTML") {
        additionalProps = {
          ...additionalProps,
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
        };
      }
      if (this.sourceType === "EMAIL") {
        additionalProps = {
          ...additionalProps,
          embedAttachments: {
            type: "boolean",
            label: "Embed Attachments",
            description: "Set to true to automatically embeds all attachments from original input email into final output PDF.",
            optional: true,
          },
          convertAttachments: {
            type: "boolean",
            label: "Convert Attachments",
            description: "Set to false if you does not want to convert attachments from original email and want to embed them as original files. set True to convert attachments that are supported by API (doc, docx, html, png, jpg etc) into PDF and merges into final output PDF.",
            optional: true,
          },
        };
      }
    }
    if (this.sourceType === "XLS") {
      additionalProps = {
        worksheetIndex: {
          type: "integer",
          label: "Worksheet Index",
          description: "Default worksheet index (zero by default).",
          optional: true,
        },
      };
    }
    return additionalProps;
  },
  async run({ $ }) {
    const param = {
      httpusername: this.httpusername,
      httppassword: this.httppassword,
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
      embedAttachments: this.embedAttachments,
      convertAttachments: this.convertAttachments,
    };
    if (this.sourceType === "HTML") {
      param.html = this.source;
    } else {
      param.url = this.source;
    }
    const response = await this.app.convertAnythingToPDF(
      $,
      this.sourceType,
      param,
    );
    $.export("$summary", `Successfully converted ${this.sourceType} to PDF`);
    return response;
  },
};
