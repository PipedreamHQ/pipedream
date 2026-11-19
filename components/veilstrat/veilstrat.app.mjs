import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import * as validation from "./common/validation.mjs";

export default {
  type: "app",
  app: "veilstrat",
  propDefinitions: {
    countries: {
      type: "string[]",
      label: "Countries",
      description: "Optional two-letter country codes, for example `US` and `GB`.",
      optional: true,
    },
  },
  methods: {
    async _makeRequest({
      $, path, method = "GET", data, params,
    }) {
      const apiKey = this.$auth.api_key;
      if (typeof apiKey !== "string" || !apiKey || /\s/.test(apiKey)) {
        throw new ConfigurationError("Connect a valid VeilStrat team API key.");
      }
      const allowedPaths = [
        "/health",
        "/stats",
        "/filters",
        "/slices",
        "/companies",
      ];
      if (!allowedPaths.includes(path) && !/^\/companies\/[0-9a-f-]{36}$/i.test(path)) {
        throw new ConfigurationError("Unsupported VeilStrat API path.");
      }
      const response = await axios($, {
        method,
        url: `https://app.veilstrat.com/api/v1${path}`,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        data,
        params,
        timeout: 20000,
        maxRedirects: 0,
        returnFullResponse: true,
        validateStatus: () => true,
      }).catch(() => {
        throw new Error("VeilStrat could not be reached. No automatic retry was attempted.");
      });
      if (response.status !== 200) {
        const messages = {
          401: "API key rejected. Check VeilStrat Settings > API.",
          403: "API access requires Pro and the API Access add-on.",
          404: "Company or slice not found. Check the current identifiers.",
          422: "Query or filters rejected. Use Get Filter Catalog for supported values.",
          429: "API quota reached. Check Get Account Usage before trying again.",
        };
        throw Object.assign(new Error(
          `VeilStrat HTTP ${response.status}: ${messages[response.status] || "Request failed."}`,
        ), {
          status: response.status,
        });
      }
      return response.data;
    },
    searchCompanies({
      $, signalQuery, countries, page = 1, pageSize = 10,
    }) {
      validation.text(signalQuery, "Signal Query");
      validation.integer(page, "Page", 1, 500);
      validation.integer(pageSize, "Page Size", 1, 50);
      if ((page - 1) * pageSize >= 500) {
        throw new ConfigurationError("Company search is limited to an offset below 500 records.");
      }
      const selectedCountries = validation.countries(countries);
      return this._makeRequest({
        $,
        path: "/companies",
        method: "POST",
        data: {
          signal_query: signalQuery.trim(),
          countries: selectedCountries.length
            ? selectedCountries
            : undefined,
          page,
          pageSize,
        },
      });
    },
    getCompany({
      $, companyId,
    }) {
      return this._makeRequest({
        $,
        path: `/companies/${validation.companyId(companyId)}`,
      });
    },
    searchSlices({
      $, slice, countries, scoreMin,
    }) {
      const selectedCountries = validation.countries(countries);
      if (!selectedCountries.length && scoreMin === undefined) {
        throw new ConfigurationError("Set Countries or Minimum Score to filter the slice.");
      }
      if (scoreMin !== undefined) {
        validation.integer(scoreMin, "Minimum Score", 0, 100);
      }
      return this._makeRequest({
        $,
        path: "/slices",
        params: {
          slice: validation.text(slice, "Slice"),
          countries: selectedCountries.length
            ? selectedCountries.join(",")
            : undefined,
          scoreMin,
        },
      });
    },
    getFilters({ $ }) {
      return this._makeRequest({
        $,
        path: "/filters",
      });
    },
    getUsage({ $ }) {
      return this._makeRequest({
        $,
        path: "/stats",
      });
    },
    getHealth({ $ }) {
      return this._makeRequest({
        $,
        path: "/health",
      });
    },
  },
};
