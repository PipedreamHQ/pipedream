import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-pdf-linearize",
  name: "Linearize a PDF",
  description: "API endpoint that linearizes any given PDF, restructuring it for faster loading and page-by-page viewing in web browsers. [See the documentation](https://apifreaks.com/docs).",
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
      path: "/v1.0/pdf/linearize",
      params: {
        "file_id": this.fileId,
        destroy: this.destroy,
        output: this.output,
        "webhook_url": this.webhookUrl,
        "webhook_failure_notification": this.webhookFailureNotification,
      },
    });
    $.export("$summary", "Successfully executed Linearize a PDF");
    return response;
  },
};
