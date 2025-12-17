import outscraper from "../../outscraper.app.mjs";

export default {
  key: "outscraper-reverse-geocoding",
  name: "Reverse Geocoding",
  description: "Translates geographic locations into human-readable addresses. [See the documentation](https://app.outscraper.com/api-docs#tag/Other-Services/paths/~1reverse-geocoding/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    outscraper,
    coordinates: {
      propDefinition: [
        outscraper,
        "coordinates",
      ],
    },
  },
  async run({ $ }) {
    const query = this.coordinates;
    const response = await this.outscraper.translateLocation({
      $,
      params: {
        query,
      },
    });
    $.export("$summary", `Successfully obtained location for ${query}`);
    return response;
  },
};
