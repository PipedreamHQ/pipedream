import discogs from "../../discogs.app.mjs";

export default {
  key: "discogs-update-order",
  name: "Update Order Status",
  description: "Updates the status of an existing order on Discogs. [See the documentation](https://www.discogs.com/developers#page:marketplace,header:marketplace-edit-an-order)",
  version: "0.0.NaN",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    discogs,
    orderId: {
      propDefinition: [
        discogs,
        "orderId",
      ],
    },
    status: {
      propDefinition: [
        discogs,
        "status",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.discogs.updateOrderStatus({
      orderId: this.orderId,
      status: this.status,
    });

    $.export("$summary", `Successfully updated the status of order ${this.orderId} to ${this.status}`);
    return response;
  },
};
