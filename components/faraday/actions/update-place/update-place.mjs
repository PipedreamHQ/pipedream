import faraday from "../../faraday.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "faraday-update-place",
  name: "Update a Place",
  description: "Updates a place with the specified ID. [See the documentation](https://faraday.ai/developers/reference/updateplace)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    faraday,
    placeId: {
      propDefinition: [
        faraday,
        "placeId",
      ],
    },
    placeData: {
      propDefinition: [
        faraday,
        "placeData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.faraday.updatePlace({
      placeId: this.placeId,
      placeData: this.placeData,
    });

    $.export("$summary", `Successfully updated place with ID: ${this.placeId}`);
    return response;
  },
};
