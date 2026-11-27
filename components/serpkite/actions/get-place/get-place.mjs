import { ConfigurationError } from "@pipedream/platform";
import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-get-place",
  name: "Get Place Details",
  description: "Get the full Google Maps listing of one place by its `place_id` (or `cid`) from **Maps Search**: address, coordinates, categories, opening hours, website, phone, rating and photos. Free when no place matches. [See the documentation](https://serpkite.com/docs/endpoints/place)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    placeId: {
      type: "string",
      label: "Place ID",
      description: "Google place ID, e.g. `ChIJLwPMoJm1RIYRetVp1EtGm10`. Use **Maps Search** to find it (the `place_id` field). Set this or CID.",
      optional: true,
    },
    cid: {
      type: "string",
      label: "CID",
      description: "Decimal customer ID, used instead of Place ID, e.g. `6727551237396018298`. Use **Maps Search** to find it (the `cid` field).",
      optional: true,
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
  },
  async run({ $ }) {
    if (!this.placeId && !this.cid) {
      throw new ConfigurationError("Set Place ID or CID.");
    }
    const response = await this.app.getPlace({
      $,
      data: {
        place_id: this.placeId,
        cid: this.cid,
        country: this.country,
        language: this.language,
      },
    });
    const place = response.results?.[0];
    $.export("$summary", place
      ? `Retrieved ${place.title ?? "place details"}`
      : "No place matched (not billed)");
    return response;
  },
};
