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
      description: "The desired base name for the output PDF files after splitting. If not provided, a default naming convention will be used.",
      optional: true,
    },
    pages: {
      type: "string",
      label: "Pages",
      description: "Defines the page numbers or ranges where the PDF should be split. Provide individual pages and/or ranges in any order (for example: \"1-4,9-5,16-last\"). Separate entries with commas and use hyphens for ranges.  Special keywords (use alone):  • `even` ",
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
