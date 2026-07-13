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
      type: "string",
      label: "File Id",
      description: "An array of unique file IDs referencing PDF files previously uploaded to the API Freaks server. Use this parameter to merge existing files without re-uploading them. Provide multiple IDs to merge files in the specified order.",
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
      description: "Specifies the desired name for the resulting merged PDF file. If not provided, a default name will be assigned.",
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
