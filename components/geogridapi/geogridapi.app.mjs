import { axios } from "@pipedream/platform";
import {
  DENSITY_OPTIONS,
  OPTIONS_PAGE_SIZE,
  SHAPE_OPTIONS,
  SIZE_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "geogridapi",
  propDefinitions: {
    placeId: {
      type: "string",
      label: "Place ID",
      description: "Google place ID of the listing (Google Business Profile), e.g. `ChIJN1t_tDeuEmsRUsoyG83frY4`."
        + " Use **Find Business** to get it from a business name and city (the `place_id` field)."
        + " Leave empty to use **Business Name and City** instead.",
      optional: true,
      async options({ prevContext }) {
        if (prevContext?.done) {
          return {
            options: [],
          };
        }
        const {
          data, next_before: nextBefore,
        } = await this.listGrids({
          params: {
            limit: OPTIONS_PAGE_SIZE,
            before: prevContext?.before,
          },
        });
        const seen = new Set(prevContext?.seen ?? []);
        const options = [];
        for (const grid of data) {
          const placeId = grid.place?.place_id;
          if (placeId && !seen.has(placeId)) {
            seen.add(placeId);
            options.push({
              label: [
                grid.place.name,
                grid.place.address,
              ].filter(Boolean).join(" — ") || placeId,
              value: placeId,
            });
          }
        }
        return {
          options,
          context: {
            before: nextBefore,
            done: !nextBefore,
            seen: [
              ...seen,
            ],
          },
        };
      },
    },
    query: {
      type: "string",
      label: "Business Name and City",
      description: "Name and city of the listing when you have no place ID; the first Google Maps match is measured, e.g. `Joe's Pizza, New York`."
        + " Provide either this or **Place ID**, not both.",
      optional: true,
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The search a customer types on Google Maps, e.g. `pizza` or `emergency plumber`.",
    },
    gridId: {
      type: "string",
      label: "Grid ID",
      description: "The ID of a grid, e.g. `3f2c9b1e-6a7d-4c1e-9f0a-2b8d7e6c5a41`."
        + " Returned by **Run Grid** (the `id` field); use **List Grids** to find past grids.",
      async options({ prevContext }) {
        if (prevContext?.done) {
          return {
            options: [],
          };
        }
        const {
          data, next_before: nextBefore,
        } = await this.listGrids({
          params: {
            limit: OPTIONS_PAGE_SIZE,
            before: prevContext?.before,
          },
        });
        return {
          options: data.map((grid) => ({
            label: `${grid.keyword} — ${grid.place?.name ?? grid.place?.place_id} (${grid.created_at.slice(0, 10)}, ${grid.status})`,
            value: grid.id,
          })),
          context: {
            before: nextBefore,
            done: !nextBefore,
          },
        };
      },
    },
    shape: {
      type: "string",
      label: "Shape",
      description: "Shape of the grid, e.g. `square`. One of `square`, `circle`, `diamond`, `hexagon`, `cross`, `ellipse`, `rectangle`. Defaults to `square`.",
      options: SHAPE_OPTIONS,
      optional: true,
    },
    size: {
      type: "integer",
      label: "Size (square only)",
      description: "Side of a square grid: `3`, `5`, `7` or `9`, e.g. `7` for 7 × 7 = 49 points (49 credits). Defaults to `7`. Only with the `square` shape.",
      options: SIZE_OPTIONS,
      optional: true,
    },
    density: {
      type: "string",
      label: "Density (other shapes)",
      description: "Number of points of a non-square shape: `low`, `medium` or `high` (13 to 49 points), e.g. `medium`. Defaults to `medium`. Not allowed with the `square` shape.",
      options: DENSITY_OPTIONS,
      optional: true,
    },
    radiusKm: {
      type: "string",
      label: "Radius (km)",
      description: "Distance from the center to the edge of the grid in kilometers, from `0.5` to `30` (other shapes: from `1`), e.g. `3`. Defaults to 1.5 to 4.5 km depending on the size.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Search language as a 2-letter code, e.g. `en`. Defaults to the account language.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Search country as a 2-letter ISO code, e.g. `US`. Optional.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of grids to return, from `1` to `100`, e.g. `20`.",
      optional: true,
      min: 1,
      max: 100,
    },
  },
  methods: {
    _makeRequest({
      $ = this, headers, ...args
    }) {
      return axios($, {
        baseURL: "https://api.geogridapi.io/v1",
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "User-Agent": "geogridapi-pipedream/0.1.0",
          ...headers,
        },
        ...args,
      });
    },
    searchPlaces(args = {}) {
      return this._makeRequest({
        url: "/places/search",
        ...args,
      });
    },
    createGrid({
      idempotencyKey, ...args
    } = {}) {
      return this._makeRequest({
        headers: idempotencyKey
          ? {
            "Idempotency-Key": idempotencyKey,
          }
          : undefined,
        method: "POST",
        url: "/grids",
        ...args,
      });
    },
    estimateGrid(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/grids/estimate",
        ...args,
      });
    },
    getGrid({
      gridId, ...args
    }) {
      return this._makeRequest({
        url: `/grids/${encodeURIComponent(gridId)}`,
        ...args,
      });
    },
    listGrids(args = {}) {
      return this._makeRequest({
        url: "/grids",
        ...args,
      });
    },
    getGridImage({
      gridId, ...args
    }) {
      return this._makeRequest({
        url: `/grids/${encodeURIComponent(gridId)}/image`,
        responseType: "arraybuffer",
        ...args,
      });
    },
    getHistory(args = {}) {
      return this._makeRequest({
        url: "/history",
        ...args,
      });
    },
    getBalance(args = {}) {
      return this._makeRequest({
        url: "/balance",
        ...args,
      });
    },
  },
};
