import piloterr from "../../piloterr.app.mjs";

export default {
  key: "piloterr-get-zillow-property",
  name: "Get Zillow Property",
  description: "Get a Zillow home from its listing URL, with its address, price, Zestimate, status, size, rooms, year built and photos. [See the documentation](https://docs.piloterr.com/v2/api-reference/zillow/property)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    piloterr,
    url: {
      type: "string",
      label: "Listing URL",
      description: "The full Zillow homedetails URL, e.g. `https://www.zillow.com/homedetails/20-Kyle-Ct-Staten-Island-NY-10312/32361983_zpid/`.",
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.getZillowProperty({
      $,
      params: {
        query: this.url,
      },
    });
    $.export("$summary", `Retrieved Zillow property ${response.zpid ?? this.url}`);
    return response;
  },
};
