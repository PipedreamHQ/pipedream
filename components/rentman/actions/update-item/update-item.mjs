import rentman from "../../rentman.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "rentman-update-item",
  name: "Update Rentman Item",
  description: "Updates the details of an existing item based on its type. [See the documentation](https://api.rentman.net)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    rentman,
    itemType: {
      propDefinition: [
        rentman,
        "itemType",
      ],
    },
    itemId: {
      propDefinition: [
        rentman,
        "itemId",
      ],
    },
    appointmentDetails: {
      propDefinition: [
        rentman,
        "appointmentDetails",
      ],
      optional: true,
    },
    // Add other item type specific prop definitions here
  },
  async run({ $ }) {
    const data = {};

    if (this.itemType === "appointment" && this.appointmentDetails) {
      data.name = this.appointmentDetails.name;
      data.start = this.appointmentDetails.start;
      data.end = this.appointmentDetails.end;
      data.color = this.appointmentDetails.color;
      data.location = this.appointmentDetails.location;
      data.remark = this.appointmentDetails.remark;
      data.isPublic = this.appointmentDetails.isPublic;
      data.isPlannable = this.appointmentDetails.isPlannable;
    }

    // Add other item type specific data handling here

    const response = await this.rentman.updateItemDetails({
      itemType: this.itemType,
      itemId: this.itemId,
      ...data,
    });

    $.export("$summary", `Successfully updated item with ID ${this.itemId}`);
    return response;
  },
};
