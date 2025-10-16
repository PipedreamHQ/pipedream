import app from "../../pdf_munk.app.mjs";

export default {
  key: "pdf_munk-capture-website-screenshot-into-pdf",
  name: "Capture Website Screenshot into PDF",
  description: "Converts a URL to a PDF file with customizable options. [See documentation](https://pdfmunk.com/api-docs#:~:text=Operations%20related%20to%20PDF)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    url: {
      type: "string",
      label: "Website URL",
      description: "The URL of the website to convert to PDF",
    },
    paper_size: {
      type: "string",
      label: "Paper Size",
      description: "The paper size for the PDF",
      options: [
        {
          label: "A4",
          value: "A4",
        },
        {
          label: "A3",
          value: "A3",
        },
        {
          label: "A5",
          value: "A5",
        },
        {
          label: "Letter",
          value: "Letter",
        },
        {
          label: "Legal",
          value: "Legal",
        },
        {
          label: "Tabloid",
          value: "Tabloid",
        },
      ],
      default: "A4",
    },
    landscape: {
      type: "boolean",
      label: "Landscape",
      description: "Whether to use landscape orientation",
      default: false,
    },
    displayHeaderFooter: {
      type: "boolean",
      label: "Display Header Footer",
      description: "Whether to display header and footer",
      default: false,
    },
    page_size: {
      type: "integer",
      label: "Page Size",
      description: "The page size in points",
      default: 5,
    },
    printBackground: {
      type: "boolean",
      label: "Print Background",
      description: "Whether to print background graphics",
      default: true,
    },
  },
  async run({ $ }) {
    const {
      url,
      paper_size,
      landscape,
      displayHeaderFooter,
      page_size,
      printBackground,
    } = this;

    const response = await this.app.captureWebsiteToPdf({
      $,
      url,
      paper_size,
      landscape,
      displayHeaderFooter,
      page_size,
      printBackground,
    });

    $.export("$summary", `Successfully converted ${url} to PDF`);
    return response;
  },
};
