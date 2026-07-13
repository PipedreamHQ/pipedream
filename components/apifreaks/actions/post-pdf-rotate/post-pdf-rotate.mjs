import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-pdf-rotate",
  name: "Rotate Pages in a PDF",
  description: "This API rotates pages of a PDF by a specified angle (in multiples of 90 degrees). [See the documentation](https://apifreaks.com/docs).",
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
      description: "The desired name for the output PDF file after rotation. If not provided, a default name will be assigned.",
      optional: true,
    },
    pages: {
      type: "string",
      label: "Pages",
      description: "Specifies which pages to rotate. Accepts individual page numbers (e.g., '1,7') and/or ascending page ranges (e.g., '3-5'). Use commas to separate entries and hyphens for ranges. Reverse ranges (e.g., '5-3') are not allowed. Alternatively, provide onl",
      optional: true,
    },
    rotate: {
      type: "string",
      label: "Rotate",
      description: "The angle in degrees to rotate the selected pages. Must be one of the following values: 0, 90, 180, 270, -90, -180, or -270. All rotations are applied clockwise.",
      optional: false,
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
      path: "/v1.0/pdf/rotate",
      params: {
        "file_id": this.fileId,
        destroy: this.destroy,
        output: this.output,
        pages: this.pages,
        rotate: this.rotate,
        "webhook_url": this.webhookUrl,
        "webhook_failure_notification": this.webhookFailureNotification,
      },
    });
    $.export("$summary", "Successfully executed Rotate Pages in a PDF");
    return response;
  },
};
