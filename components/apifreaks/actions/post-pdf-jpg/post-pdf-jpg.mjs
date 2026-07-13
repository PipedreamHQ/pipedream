import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-pdf-jpg",
  name: "Convert PDF to JPG",
  description: "This API converts a given PDF file into a sequence of JPG images. [See the documentation](https://apifreaks.com/docs).",
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
      description: "The desired name for the output unrestricted PDF file. If not provided, a default name will be assigned.",
      optional: true,
    },
    quality: {
      type: "string",
      label: "Quality",
      description: "Controls JPG compression quality. Higher values yield sharper images with larger file sizes.",
      optional: true,
    },
    pages: {
      type: "string",
      label: "Pages",
      description: "Specifies the pages or ranges at which to split the PDF. Accepts individual page numbers (e.g., '1') and/or page ranges (e.g., '4-2', 'last'). Ranges can be ascending or descending. Use commas to separate entries and hyphens for ranges. Alternatively",
      optional: true,
    },
    resolution: {
      type: "string",
      label: "Resolution",
      description: "Specifies the resolution (in DPI) for the output images. Acceptable Range is from 20 to 1200.",
      optional: true,
    },
    imageSmoothing: {
      type: "string",
      label: "Image Smoothing",
      description: "Determines the smoothing options to apply during image conversion. Valid values are 'none', 'all' or a combination of 'text', 'line', and 'image' (comma-separated).If not provided, no smoothing will be applied.",
      optional: true,
    },
    profile: {
      type: "string",
      label: "Profile",
      description: "Specifies the color profile for the output PNG images. Acceptable values: bw (1-bit black & white, smallest size, no grayscale or color), gray (8-bit grayscale), rgb (24-bit RGB color, default), rgba (32-bit RGB color with alpha channel for transpare",
      optional: true,
      options: ["gray","rgb","cmyk"],
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
      path: "/v1.0/pdf/jpg",
      params: {
        "file_id": this.fileId,
        destroy: this.destroy,
        output: this.output,
        quality: this.quality,
        pages: this.pages,
        resolution: this.resolution,
        "image_smoothing": this.imageSmoothing,
        profile: this.profile,
        "webhook_url": this.webhookUrl,
        "webhook_failure_notification": this.webhookFailureNotification,
      },
    });
    $.export("$summary", "Successfully executed Convert PDF to JPG");
    return response;
  },
};
