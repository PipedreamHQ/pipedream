import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-search-zip-by-city",
  name: "Search Zip/Postal Codes by City",
  description: "Search ZIP/postal codes by city [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    city: {
      type: "string",
      label: "City",
      description: "Name of the city in which we want to find zipcodes in.",
      optional: false,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country code in ISO 3166-1 alpha-2 format.",
      optional: false,
    },
    stateName: {
      type: "string",
      label: "State Name",
      description: "Name of the state or province associated with the country.",
      optional: true,
    },
    page: {
      type: "string",
      label: "Page",
      description: "Page number to retrieve paginated results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/zipcode/search/city",
      params: {
        city: this.city,
        country: this.country,
        "state_name": this.stateName,
        page: this.page,
      },
    });
    $.export("$summary", "Successfully executed Search Zip/Postal Codes by City");
    return response;
  },
};
