import faraday from "../../faraday.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "faraday-create-place",
  name: "Create a New Place",
  description: "Creates a new place in Faraday. [See the documentation](https://faraday.ai/developers/reference/createplace)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    faraday,
    placeData: {
      propDefinition: [
        faraday,
        "placeData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.faraday.createPlace({
      placeData: this.placeData,
    });
    $.export("$summary", `Successfully created a new place with ID: ${response.id}`);
    return response;
  },
};
