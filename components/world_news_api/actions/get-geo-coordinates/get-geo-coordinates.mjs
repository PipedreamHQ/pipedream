import app from "../../world_news_api.app.mjs";

export default {
  name: "Get Geo Coordinates",
  description: "Retrieve the latitude and longitude of a location name. [See the docs here](https://worldnewsapi.com/docs/#Get-Geo-Coordinates). **Calling this endpoint requires 1 point.**",
  key: "world_news_api-get-geo-coordinates",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    location: {
      type: "string",
      label: "Location",
      description: "The address or name of the location.",
    },
  },
  async run({ $ }) {
    const params = {
      location: this.location,
    };
    const res = await this.app.getGeoCoordinates(params, $);
    $.export("$summary", `Geo coordinates for ${this.location} successfully retrieved`);
    return res;
  },
};
