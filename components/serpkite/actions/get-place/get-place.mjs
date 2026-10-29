import { ConfigurationError } from "@pipedream/platform";
import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-get-place",
  name: "Get Place Details",
  description: "Get the full Google Maps listing of one place by its `place_id` (or `cid`) from a Maps Search result: address, coordinates, categories, opening hours, website, phone, rating and photos. Free when no place matches. [See the documentation](https://serpkite.com/docs/endpoints/place)",
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
      description: "Google place ID (`ChIJ\u2026`) from a Maps Search result.",
      optional: true,
    },
    cid: {
      type: "string",
      label: "CID",
      description: "Decimal customer ID from a Maps Search result, instead of Place ID.",
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
    const response = await this.app.post({
      $,
      path: "/place",
      data: {
        place_id: this.placeId,
        cid: this.cid,
        country: this.country,
        language: this.language,
      },
    });
    $.export("$summary", `Retrieved ${response.place?.title ?? "place details"}`);
    return response;
  },
};
