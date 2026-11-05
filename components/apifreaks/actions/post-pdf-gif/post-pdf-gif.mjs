import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-pdf-gif",
  name: "Convert PDF to GIF",
  description: "This API converts a given PDF file into a sequence of GIF images. [See the documentation](https://apifreaks.com/docs).",
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
      description: "The desired name for the output unrestricted PDF file. If not provided, a default name will be assigned.",
      optional: true,
    },
    pages: {
      propDefinition: [
        app,
        "pages",
      ],
    },
    resolution: {
      propDefinition: [
        app,
        "resolution",
      ],
    },
    imageSmoothing: {
      propDefinition: [
        app,
        "imageSmoothing",
      ],
    },
    profile: {
      type: "string",
      label: "Profile",
      description: "Specifies the color profile for the output PNG images. Acceptable values: bw (1-bit black & white, smallest size, no grayscale or color), gray (8-bit grayscale), rgb (24-bit RGB color, default), rgba (32-bit RGB color with alpha channel for transpare",
      optional: true,
      options: ["bw","gray","rgb","rgba","4-bit","8-bit"],
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
      path: "/v1.0/pdf/gif",
      params: {
        "file_id": this.fileId,
        destroy: this.destroy,
        output: this.output,
        pages: this.pages,
        resolution: this.resolution,
        "image_smoothing": this.imageSmoothing,
        profile: this.profile,
        "webhook_url": this.webhookUrl,
        "webhook_failure_notification": this.webhookFailureNotification,
      },
    });
    $.export("$summary", "Successfully executed Convert PDF to GIF");
    return response;
  },
};
