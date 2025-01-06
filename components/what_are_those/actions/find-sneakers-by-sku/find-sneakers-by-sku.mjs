import what_are_those from "../../what_are_those.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "what_are_those-find-sneakers-by-sku",
  name: "Find Sneakers by SKU",
  description: "Identifies sneakers from a size tag photo and returns sneaker name and details. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    what_are_those: {
      type: "app",
      app: "what_are_those",
    },
    sizeTagPhoto: {
      propDefinition: [
        "what_are_those",
        "sizeTagPhoto",
      ],
    },
  },
  async run({ $ }) {
    const sneakerData = await this.what_are_those.identifySneakersFromSizeTag({
      sizeTagPhoto: this.sizeTagPhoto,
    });
    const sneakerName = sneakerData.name;
    const sneakerDetails = sneakerData.details;
    $.export("$summary", `Identified sneaker: ${sneakerName}`);
    return {
      name: sneakerName,
      details: sneakerDetails,
    };
  },
};
