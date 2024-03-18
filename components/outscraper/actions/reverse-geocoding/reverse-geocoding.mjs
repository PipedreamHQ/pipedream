import outscraper from "../../outscraper.app.mjs";

export default {
  key: "outscraper-reverse-geocoding",
  name: "Reverse Geocoding",
  description: "Translates geographic locations into human-readable addresses. [See the documentation](https://app.outscraper.com/api-docs#tag/Other-Services/paths/~1reverse-geocoding/get)",
  version: "0.0.1",
  type: "action",
  props: {
    outscraper,
    latitude: {
      type: "string",
      label: "Latitude",
      description: "The latitude of the location to translate into a human-readable address, e.g. `37.427074`",
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "The longitude of the location to translate into a human-readable address, e.g. `-122.1439166`",
    },
  },
  async run({ $ }) {
    const query = [
      this.latitude,
      this.longitude,
    ].join();
    const response = await this.outscraper.translateLocation({
      $,
      query,
    });
    $.export("$summary", `Successfully obtained location for ${query}`);
    return response;
  },
};
