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
      type: "string",
      label: "File Id",
      description: "The unique ID of a PDF file already uploaded to the API Freaks server. Use this as an alternative to uploading a new file.",
      optional: true,
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
      type: "string",
      label: "Destroy",
      description: "If set to true, the input file(s) will be deleted from the server immediately after the output is generated.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook Url",
      description: "The URL to which the webhook notification will be sent after the task is completed.",
      optional: true,
    },
    webhookFailureNotification: {
      type: "string",
      label: "Webhook Failure Notification",
      description: "If true, a notification will also be sent by email in case the webhook request fails all the retries.  The email notification will be sent to the requesting user or their organization’s admin if part of one.",
      optional: true,
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
