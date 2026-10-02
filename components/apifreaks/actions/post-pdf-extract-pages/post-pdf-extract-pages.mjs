import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-pdf-extract-pages",
  name: "Extract Pages From a PDF",
  description: "This API extracts specific pages or page ranges from a PDF file and returns them as a new PDF. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    fileId: {
      propDefinition: [
        app,
        "fileId",
      ],
    },
    destroy: {
      propDefinition: [
        app,
        "destroy",
      ],
    },
    output: {
      type: "string",
      label: "Output",
      description: "The desired name for the output PDF file after pages have been extracted. If not provided, a default name will be assigned.",
      optional: true,
    },
    pages: {
      type: "string",
      label: "Pages",
      description: "Specifies which pages to extract from the PDF. You can provide individual page numbers (e.g., '2') and/or page ranges in any order, including descending (e.g., '9-5', '16-last'). Use commas to separate entries and hyphens for ranges. You may alternat",
      optional: false,
    },
    separated: {
      type: "string",
      label: "Separated",
      description: "If set to `true`, each of the specified pages will be extracted and returned as a separate PDF file.",
      optional: true,
    },
    webhookUrl: {
      propDefinition: [
        app,
        "webhookUrl",
      ],
    },
    webhookFailureNotification: {
      propDefinition: [
        app,
        "webhookFailureNotification",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/pdf/extract-pages",
      params: {
        "file_id": this.fileId,
        destroy: this.destroy,
        output: this.output,
        pages: this.pages,
        separated: this.separated,
        "webhook_url": this.webhookUrl,
        "webhook_failure_notification": this.webhookFailureNotification,
      },
    });
    $.export("$summary", "Successfully executed Extract Pages From a PDF");
    return response;
  },
};
