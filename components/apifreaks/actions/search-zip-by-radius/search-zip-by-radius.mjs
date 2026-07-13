import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-search-zip-by-radius",
  name: "Find Zip/Postal Codes Within a Radius",
  description: "Find ZIP/postal codes within a radius [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    code: {
      type: "string",
      label: "Code",
      description: "Postal/Zip code to be used as the center point for the search.",
      optional: true,
    },
    lat: {
      type: "string",
      label: "Lat",
      description: "Latitude coordinate for the base location.",
      optional: true,
    },
    long: {
      type: "string",
      label: "Long",
      description: "Longitude coordinate for the base location.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country code in ISO 3166-1 alpha-2 format. Required only when using the code parameter.",
      optional: true,
    },
    radius: {
      type: "string",
      label: "Radius",
      description: "Search radius for the query. The maximum allowed values are: - 100 km - 100 mi - 109361 yd - 100000 m - 328084 ft - 3937007.75 in",
      optional: false,
    },
    unit: {
      type: "string",
      label: "Unit",
      description: "Supported distance units are m, km, mi, ft, yd, in.",
      optional: true,
      options: ["m","km","mi","ft","yd","in"],
    },
    page: {
      type: "string",
      label: "Page",
      description: "Page no. to retrieve paginated results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/zipcode/search/radius",
      params: {
        code: this.code,
        lat: this.lat,
        long: this.long,
        country: this.country,
        radius: this.radius,
        unit: this.unit,
        page: this.page,
      },
    });
    $.export("$summary", "Successfully executed Find Zip/Postal Codes Within a Radius");
    return response;
  },
};
