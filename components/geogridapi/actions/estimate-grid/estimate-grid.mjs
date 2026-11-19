import geogridapi from "../../geogridapi.app.mjs";
import { buildGridBody } from "../../common/utils.mjs";

export default {
  key: "geogridapi-estimate-grid",
  name: "Estimate Grid",
  description: "Get the exact number of points and credits a grid would cost before running it, and the balance after (`credits`, `balance_after`, `enough`). Free: nothing is reserved or charged."
    + " Takes the same inputs as **Run Grid**; points at sea are removed for non-square shapes."
    + " [See the documentation](https://geogridapi.io/en/docs#estimate)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    geogridapi,
    placeId: {
      propDefinition: [
        geogridapi,
        "placeId",
      ],
    },
    query: {
      propDefinition: [
        geogridapi,
        "query",
      ],
    },
    keyword: {
      propDefinition: [
        geogridapi,
        "keyword",
      ],
    },
    shape: {
      propDefinition: [
        geogridapi,
        "shape",
      ],
    },
    size: {
      propDefinition: [
        geogridapi,
        "size",
      ],
    },
    density: {
      propDefinition: [
        geogridapi,
        "density",
      ],
    },
    radiusKm: {
      propDefinition: [
        geogridapi,
        "radiusKm",
      ],
    },
    language: {
      propDefinition: [
        geogridapi,
        "language",
      ],
    },
    country: {
      propDefinition: [
        geogridapi,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const estimate = await this.geogridapi.estimateGrid({
      $,
      data: buildGridBody(this),
    });
    $.export("$summary", `This grid would measure ${estimate.points} points for ${estimate.credits} credits`);
    return estimate;
  },
};
