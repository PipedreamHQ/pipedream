import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "tablejourney",
  propDefinitions: {
    country: {
      type: "string",
      label: "Country",
      description: "The country slug, e.g. `italy` or `united-states`."
        + " Use **List Cities** to find valid slugs (the `country` field). Country names such as `Italy` are also accepted.",
      async options() {
        const cities = await this.listCities();
        const countries = new Map();
        for (const city of cities) {
          countries.set(city.country, city.country_name);
        }
        return [
          ...countries.entries(),
        ]
          .sort((a, b) => a[1].localeCompare(b[1]))
          .map(([
            value,
            label,
          ]) => ({
            label,
            value,
          }));
      },
    },
    city: {
      type: "string",
      label: "City",
      description: "The city slug, e.g. `rome` or `new-york-city`."
        + " Use **List Cities** to find valid slugs (the `city` field). City names such as `New York City` are also accepted; an unknown city returns an error with `did_you_mean` suggestions.",
      async options({ country }) {
        const cities = await this.listCities({
          params: {
            country,
          },
        });
        return cities.map((city) => ({
          label: `${city.name}, ${city.country_name}`,
          value: city.city,
        }));
      },
    },
    query: {
      type: "string",
      label: "Query",
      description: "Free text to match, e.g. `carbonara`.",
      optional: true,
    },
    dateFrom: {
      type: "string",
      label: "Date From",
      description: "Start of the date window, as an ISO 8601 date, e.g. `2026-11-01`.",
      optional: true,
    },
    dateTo: {
      type: "string",
      label: "Date To",
      description: "End of the date window, as an ISO 8601 date, e.g. `2026-11-05`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return, e.g. `10`. Defaults to `20`."
        + " Without an API key on the connected account, at most `20` results are returned.",
      min: 1,
      max: constants.MAX_LIMIT,
      optional: true,
    },
  },
  methods: {
    _makeRequest({
      $ = this, headers, ...opts
    }) {
      const apiKey = this.$auth?.api_key;
      return axios($, {
        baseURL: constants.BASE_URL,
        headers: {
          "Accept": "application/json",
          ...(apiKey && {
            "Authorization": `Bearer ${apiKey}`,
          }),
          ...headers,
        },
        ...opts,
      });
    },
    _cityPath(country, city) {
      return `${encodeURIComponent(country)}/${encodeURIComponent(city)}`;
    },
    listCities(opts = {}) {
      return this._makeRequest({
        url: "/cities",
        ...opts,
      });
    },
    getThingsToDo({
      country, city, ...opts
    }) {
      return this._makeRequest({
        url: `/things-to-do/${this._cityPath(country, city)}`,
        ...opts,
      });
    },
    searchPlaces(opts = {}) {
      return this._makeRequest({
        url: "/places",
        ...opts,
      });
    },
    listFestivals(opts = {}) {
      return this._makeRequest({
        url: "/festivals",
        ...opts,
      });
    },
    listExperiences(opts = {}) {
      return this._makeRequest({
        url: "/experiences",
        ...opts,
      });
    },
    listStays({
      country, city, ...opts
    }) {
      return this._makeRequest({
        url: `/stays/${this._cityPath(country, city)}`,
        ...opts,
      });
    },
    listDishes(opts = {}) {
      return this._makeRequest({
        url: "/dishes",
        ...opts,
      });
    },
  },
};
