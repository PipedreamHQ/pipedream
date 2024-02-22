import faraday from "../../faraday.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "faraday-delete-place",
  name: "Delete a Place",
  description: "Deletes a place with the specified ID in Faraday. [See the documentation](https://faraday.ai/developers/reference/deleteplace)",
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
  },
  async run({ $ }) {
    const response = await this.faraday.deletePlace({
      placeId: this.placeId,
    });
    $.export("$summary", `Successfully deleted place with ID ${this.placeId}`);
    return response;
  },
};
