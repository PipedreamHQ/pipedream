import solcast from "../../solcast.app.mjs";

export default {
  key: "solcast-get-monthly-averages",
  name: "Get Monthly Averages",
  description: "Get montly weather averages for a location. [See the documentation](https://docs.solcast.com.au/#7ad3c227-d385-4455-b17f-3efcb8d4c695)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    solcast,
    latitude: {
      propDefinition: [
        solcast,
        "latitude",
      ],
    },
    longitude: {
      propDefinition: [
        solcast,
        "longitude",
      ],
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Date time to return in data set. Accepted values are `utc`, `longitudinal`, or a range `-13` to `13` for utc offset.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.solcast.getMonthlyAverages({
      $,
      params: {
        latitude: this.latitude,
        longitude: this.longitude,
        timezone: this.timezone,
      },
    });
    $.export("$summary", `Successfully retrieved monthly averages for location \`${this.latitude}, ${this.longitude}\``);
    return response;
  },
};
