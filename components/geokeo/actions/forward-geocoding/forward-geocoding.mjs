import app from "../../geokeo.app.mjs";

export default {
  key: "geokeo-forward-geocoding",
  name: "Forward Geocoding",
  description: "Convert address data into geographic coordinates. [See the documentation](https://geokeo.com/documentation.php#request-forward-geocoding)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.forwardGeocoding({
      $,
      params: {
        q: this.q,
      },
    });

    $.export("$summary", `${response.results.length} results found`);

    return response;
  },
};
