import bigDataCloud from "../../big_data_cloud.app.mjs";

export default {
  key: "big_data_cloud-reverse-geocode",
  name: "Reverse Geocode",
  description: "Convert a user's coordinates to a human-readable address. [See the documentation](https://www.bigdatacloud.com/docs/api/reverse-geocode-to-city-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bigDataCloud,
    latitude: {
      propDefinition: [
        bigDataCloud,
        "latitude",
      ],
    },
    longitude: {
      propDefinition: [
        bigDataCloud,
        "longitude",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bigDataCloud.reverseGeocode({
      params: {
        latitude: this.latitude,
        longitude: this.longitude,
      },
      $,
    });
    if (response) {
      $.export("$summary", "Successfully converted coordinates to address.");
    }
    return response;
  },
};
