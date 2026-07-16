import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-expose-customer-media",
  name: "Expose Customer Media",
  description: "Retrieve a temporary signed URL granting a customer access to a private media file. [See the documentation](https://developer.surecart.com/api-reference/customers/expose-media)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    customerId: {
      propDefinition: [
        surecart,
        "customerId",
      ],
    },
    mediaId: {
      type: "string",
      label: "Media ID",
      description: "The unique identifier of the media file to expose. Example: `media_abc123`",
    },
    exposeFor: {
      type: "integer",
      label: "Expose For (seconds)",
      description: "Duration in seconds for which the private URL remains valid. Maximum `86400` (24 hours). Defaults to `900` (15 minutes). Example: `3600`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.exposeCustomerMedia({
      $,
      customerId: this.customerId,
      mediaId: this.mediaId,
      params: {
        expose_for: this.exposeFor,
      },
    });
    $.export("$summary", `Successfully retrieved media URL for customer ${this.customerId}`);
    return response;
  },
};
