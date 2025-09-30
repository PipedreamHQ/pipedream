import bigDataCloud from "../../big_data_cloud.app.mjs";

export default {
  key: "big_data_cloud-get-time-zone-by-location",
  name: "Get Time Zone by Location",
  description: "Retrieve time zone data for a specified location. [See the documentation](https://www.bigdatacloud.com/docs/api/timezone-by-location-api)",
  version: "0.0.2",
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
    const response = await this.bigDataCloud.timeZoneByLocation({
      params: {
        latitude: this.latitude,
        longitude: this.longitude,
      },
      $,
    });
    if (response) {
      $.export("$summary", "Successfully retrieved time zone information.");
    }
    return response;
  },
};
