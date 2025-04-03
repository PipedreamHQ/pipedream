import apiverve from "../../apiverve.app.mjs";

export default {
  key: "apiverve-get-weather",
  name: "Get Weather",
  description: "Return the temperature, humidity, and more for a given location. [See the documentation](https://docs.apiverve.com/api/weatherforecast)",
  version: "0.0.1",
  type: "action",
  props: {
    apiverve,
    lookupType: {
      type: "string",
      label: "Lookup Type",
      description: "Whether to search by city or zip code",
      options: [
        "city",
        "zip code",
      ],
      reloadProps: true,
    },
  },
  additionalProps() {
    const props = {};
    if (!this.lookupType) {
      return props;
    }
    if (this.lookupType === "city") {
      props.city = {
        type: "string",
        label: "City",
        description: "The city for which you want to get the current weather (e.g., San Francisco)",
      };
    }
    if (this.lookupType === "zip code") {
      props.zip = {
        type: "string",
        label: "Zip Code",
        description: "The zip code for which you want to get the current weather (e.g., 64082)",
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.apiverve.getWeather({
      $,
      params: {
        city: this.city,
        zip: this.zip,
      },
    });
    if (response?.status === "ok") {
      $.export("$summary", `Successfully retrieved weather for ${this.city || this.zip}`);
    }
    return response;
  },
};
