import accuweather from "../../accuweather.app.mjs";

export default {
  key: "accuweather-get-location-key",
  name: "Get Location Key",
  description: "Search for a location and retrieve its unique location key required for weather API calls. [See the documentation](https://developer.accuweather.com/accuweather-locations-api/apis/get/locations/v1/search)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    accuweather,
    locationQuery: {
      type: "string",
      label: "Location Query",
      description: "Search query for location (e.g., 'New York', 'London', 'Tokyo').",
    },
  },
  async run({ $ }) {
    const response = await this.accuweather.searchLocation({
      $,
      params: {
        q: this.locationQuery,
      },
    });

    let summary = `Successfully found ${response.length} location${response.length === 1
      ? ""
      : "s"}`;

    if (response.length === 0) {
      summary = `No location found for query: ${this.locationQuery}`;
    }

    $.export("$summary", summary);
    return response;
  },
};
