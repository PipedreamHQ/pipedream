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
