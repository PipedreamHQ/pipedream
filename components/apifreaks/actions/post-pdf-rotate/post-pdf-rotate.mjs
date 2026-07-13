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
      description: "The desired name for the output PDF file after rotation. If not provided, a default name will be assigned.",
      optional: true,
    },
    pages: {
      propDefinition: [
        app,
        "pages",
      ],
    },
    rotate: {
      type: "string",
      label: "Rotate",
      description: "The angle in degrees to rotate the selected pages. Must be one of the following values: 0, 90, 180, 270, -90, -180, or -270. All rotations are applied clockwise.",
      optional: false,
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
