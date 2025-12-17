import app from "../../pdf_munk.app.mjs";

export default {
  key: "pdf_munk-convert-html-to-pdf",
  name: "Convert HTML to PDF",
  description: "Converts HTML/CSS content to a PDF file with customizable options. [See documentation](https://pdfmunk.com/api-docs#:~:text=Operations%20related%20to%20PDF)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    html_content: {
      type: "string",
      label: "HTML Content",
      description: "The HTML content to convert to PDF",
    },
    css_content: {
      type: "string",
      label: "CSS Content",
      description: "The CSS content to style the HTML",
      optional: true,
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
    page_size: {
      type: "integer",
      label: "Page Size",
      description: "The page size in points",
      default: 2,
    },
  },
  async run({ $ }) {
    const {
      html_content,
      css_content,
      paper_size,
      page_size,
    } = this;

    const response = await this.app.convertHtmlToPdf({
      $,
      html_content,
      css_content,
      paper_size,
      page_size,
    });

    $.export("$summary", "Successfully converted HTML to PDF");
    return response;
  },
};
