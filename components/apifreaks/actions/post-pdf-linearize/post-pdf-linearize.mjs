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
      type: "string",
      label: "File Id",
      description: "The unique ID of a PDF file already uploaded to the API Freaks server. Use this as an alternative to uploading a new file directly.",
      optional: true,
    },
    destroy: {
      type: "string",
      label: "Destroy",
      description: "If set to `true`, the input file(s) will be permanently deleted from the server immediately after the output PDF is generated.",
      optional: true,
    },
    output: {
      type: "string",
      label: "Output",
      description: "The desired name for the output PDF file after pages have been extracted. If not provided, a default name will be assigned.",
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
