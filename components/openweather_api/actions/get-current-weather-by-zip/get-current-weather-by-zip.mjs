// legacy_hash_id: a_B0izKM
import { axios } from "@pipedream/platform";

export default {
  key: "openweather_api-get-current-weather-by-zip",
  name: "Get Current Weather by ZIP code",
  description: "Retrieves the current weather for a given (ZIP, country)",
  version: "0.2.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    openweather_api: {
      type: "app",
      app: "openweather_api",
    },
    country_code: {
      type: "string",
      label: "Country Code",
      description: "The 2 or 3-letter country code, for example \"US\" for the United States. Defaults to US.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "ZIP code",
      description: "ZIP code",
    },
    units: {
      type: "string",
      label: "Units",
      description: "Units of measurement",
      optional: true,
      options: [
        "kelvin",
        "imperial",
        "metric",
      ],
    },
  },
  async run({ $ }) {
    const { zip } = this;
    const countryCode = this.country_code || "US";
    // The OpenWeather API defaults to Kelvin
    const units = this.units || "kelvin";

    return await axios($, {
      url: "https://api.openweathermap.org/data/2.5/weather",
      params: {
        zip: `${zip},${countryCode}`,
        appid: `${this.openweather_api.$auth.api_key}`,
        units,
      },
    });
  },
};
