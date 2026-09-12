import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-pdf-split",
  name: "Split a PDF Into Smaller Files",
  description: "This API splits a PDF into multiple parts based on specified page numbers or ranges. [See the documentation](https://apifreaks.com/docs).",
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
      description: "The desired base name for the output PDF files after splitting. If not provided, a default naming convention will be used.",
      optional: true,
    },
    pages: {
      propDefinition: [
        app,
        "pages",
      ],
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
      path: "/v1.0/pdf/split",
      params: {
        "file_id": this.fileId,
        destroy: this.destroy,
        output: this.output,
        pages: this.pages,
        "webhook_url": this.webhookUrl,
        "webhook_failure_notification": this.webhookFailureNotification,
      },
    });
    $.export("$summary", "Successfully executed Split a PDF Into Smaller Files");
    return response;
  },
};
