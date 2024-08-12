import rentman from "../../rentman.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "rentman-create-item",
  name: "Create Item",
  description: "Creates a new item based on the specified type. [See the documentation](https://api.rentman.net/)",
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
    appointmentDetails: {
      propDefinition: [
        rentman,
        "appointmentDetails",
      ],
      optional: true,
    },
    itemId: {
      propDefinition: [
        rentman,
        "itemId",
      ],
      optional: true,
    },
    fileName: {
      propDefinition: [
        rentman,
        "fileName",
      ],
      optional: true,
    },
    fileContent: {
      propDefinition: [
        rentman,
        "fileContent",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};

    if (this.itemType === "appointment" && this.appointmentDetails) {
      data.details = this.appointmentDetails;
    } else if (this.itemType === "contact" && this.itemId) {
      data.itemId = this.itemId;
    } else if (this.itemType === "file" && this.fileName && this.fileContent) {
      data.fileName = this.fileName;
      data.fileContent = this.fileContent;
    }

    const response = await this.rentman.createNewItem({
      itemType: this.itemType,
      ...data,
    });

    $.export("$summary", `Successfully created item of type ${this.itemType}`);
    return response;
  },
};
