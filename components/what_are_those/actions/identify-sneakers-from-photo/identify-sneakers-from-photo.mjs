import what_are_those from "../../what_are_those.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "what_are_those-identify-sneakers-from-photo",
  name: "Identify Sneakers from Photo",
  description: "Identifies sneakers from an uploaded image and returns details such as name, links, images, prices, and confidence scores. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    what_are_those,
    image: {
      propDefinition: [
        what_are_those,
        "image",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.what_are_those.identifySneakers({
      image: this.image,
    });
    const sneakerCount = Array.isArray(response)
      ? response.length
      : 1;
    $.export("$summary", `Identified ${sneakerCount} sneakers successfully`);
    return response;
  },
};
