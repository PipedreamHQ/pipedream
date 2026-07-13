import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-zipcode-distance-match",
  name: "Get Matching Zip/Postal Code Pairs Within a Distance",
  description: "Get matching ZIP/postal code pairs within a specified distance. Maximum \`100\` postal codes per request. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    codes: {
      type: "string",
      label: "Codes",
      description: "Comma-separated list of postal/zip codes. Maximum 100 values allowed.",
      optional: false,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country code in ISO 3166-1 alpha-2 format.",
      optional: false,
    },
    distance: {
      type: "string",
      label: "Distance",
      description: "Maximum allowed distance between postal code pairs.",
      optional: true,
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
      path: "/v1.0/zipcode/distance/match",
      data: {
        codes: this.codes,
        country: this.country,
        distance: this.distance,
        unit: this.unit,
      },
    });
    $.export("$summary", "Successfully executed Get Matching Zip/Postal Code Pairs Within a Distance");
    return response;
  },
};
