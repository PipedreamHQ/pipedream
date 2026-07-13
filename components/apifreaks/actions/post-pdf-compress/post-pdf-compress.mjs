import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-pdf-compress",
  name: "Compress a PDF File",
  description: "This API compresses a given PDF file to reduce its file size. [See the documentation](https://apifreaks.com/docs).",
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
    output: {
      type: "string",
      label: "Output",
      description: "Name of the output PDF.",
      optional: true,
    },
    compressionLevel: {
      type: "string",
      label: "Compression Level",
      description: "Controls how aggressively the PDF is compressed. Lower levels preserve more quality, while higher levels reduce file size more.",
      optional: false,
      options: ["low","balanced","high","extreme"],
    },
    destroy: {
      propDefinition: [
        app,
        "destroy",
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
      path: "/v1.0/pdf/compress",
      params: {
        "file_id": this.fileId,
        output: this.output,
        "compression_level": this.compressionLevel,
        destroy: this.destroy,
        "webhook_url": this.webhookUrl,
        "webhook_failure_notification": this.webhookFailureNotification,
      },
    });
    $.export("$summary", "Successfully executed Compress a PDF File");
    return response;
  },
};
