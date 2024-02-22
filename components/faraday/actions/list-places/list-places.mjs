import faraday from "../../faraday.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "faraday-list-places",
  name: "List Places",
  description: "Get a list of the places available in the developer’s Faraday account. [See the documentation](https://faraday.ai/developers/reference/getplaces)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    faraday,
  },
  async run({ $ }) {
    const response = await this.faraday.getPlaces();
    $.export("$summary", "Successfully retrieved the list of places.");
    return response;
  },
};
