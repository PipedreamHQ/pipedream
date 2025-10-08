import accuweather from "../../accuweather.app.mjs";

export default {
  key: "accuweather-get-current-conditions",
  name: "Get Current Conditions",
  description: "Retrieve current weather conditions for a specific location using its location key. [See the documentation](https://developer.accuweather.com/accuweather-current-conditions-api/apis/get/currentconditions/v1/%7BlocationKey%7D)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    accuweather,
    locationKey: {
      propDefinition: [
        accuweather,
        "locationKey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.accuweather.getCurrentConditions({
      $,
      locationKey: this.locationKey,
    });
    $.export("$summary", `Retrieved current conditions for location key: ${this.locationKey}`);
    return response;
  },
};
