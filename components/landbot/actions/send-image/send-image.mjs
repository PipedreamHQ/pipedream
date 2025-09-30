import landbot from "../../landbot.app.mjs";

export default {
  key: "landbot-send-image",
  name: "Send Image",
  description: "Send an image to a customer via Landbot. [See the docs](https://api.landbot.io/#api-Customers-PostHttpsApiLandbotIoV1CustomersCustomer_idSend_image)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    landbot,
    customerId: {
      propDefinition: [
        landbot,
        "customerId",
      ],
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image to send",
    },
    caption: {
      type: "string",
      label: "Caption",
      description: "Optional caption for the image",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.landbot.sendImageMessage({
      $,
      customerId: this.customerId,
      data: {
        url: this.imageUrl,
        caption: this.caption,
      },
    });
    $.export("$summary", `Successfully sent image to Customer ID: ${this.customerId}`);
    return response;
  },
};
