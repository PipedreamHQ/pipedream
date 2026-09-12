import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-pdf-merge",
  name: "Combine Multiple PDF Files Into One",
  description: "This API merges multiple PDF files into a single PDF, in the order they are provided [See the documentation](https://apifreaks.com/docs).",
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
      description: "Specifies the desired name for the resulting merged PDF file. If not provided, a default name will be assigned.",
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
      path: "/v1.0/pdf/merge",
      params: {
        "file_id": this.fileId,
        destroy: this.destroy,
        output: this.output,
        "webhook_url": this.webhookUrl,
        "webhook_failure_notification": this.webhookFailureNotification,
      },
    });
    $.export("$summary", "Successfully executed Combine Multiple PDF Files Into One");
    return response;
  },
};
