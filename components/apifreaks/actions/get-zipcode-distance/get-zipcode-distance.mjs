import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-zipcode-distance",
  name: "Get Distance Between Postal Codes",
  description: "Get distance between postal codes. Maximum `100` postal codes per request. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    compare: {
      type: "string",
      label: "Compare",
      description: "Comma separated list of postal / zip codes with which base point is compared w.r.t. Max 100 zip codes can be provided.",
      optional: false,
    },
    code: {
      type: "string",
      label: "Code",
      description: "Postal/Zip code to be used as the base point.",
      optional: true,
    },
    lat: {
      propDefinition: [
        app,
        "lat",
      ],
    },
    long: {
      propDefinition: [
        app,
        "long",
      ],
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country code in ISO 3166-1 alpha-2 format.",
      optional: false,
    },
    unit: {
      type: "string",
      label: "Unit",
      description: "Supported distance units are m, km, mi, ft, yd, in.",
      optional: true,
      options: ["m","km","mi","ft","yd","in"],
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/zipcode/distance",
      data: {
        compare: this.compare,
        code: this.code,
        lat: this.lat,
        long: this.long,
        country: this.country,
        unit: this.unit,
      },
    });
    $.export("$summary", "Successfully executed Get Distance Between Postal Codes");
    return response;
  },
};
