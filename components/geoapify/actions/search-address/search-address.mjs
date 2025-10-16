import geoapify from "../../geoapify.app.mjs";

export default {
  key: "geoapify-search-address",
  name: "Search Address",
  description: "Retrieves geocoding information for a given address. [See the documentation](https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    geoapify,
    address: {
      type: "string",
      label: "Address",
      description: "The address to search. E.g. `44 Montgomery St., San Francisco, CA 94104`",
    },
    type: {
      propDefinition: [
        geoapify,
        "locationType",
      ],
    },
    format: {
      propDefinition: [
        geoapify,
        "format",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.geoapify.geocodeAddress({
      $,
      params: {
        text: this.address,
        type: this.type,
        format: this.format,
      },
    });
    $.export("$summary", `Successfully retrieved geocoding information for address: ${this.address}`);
    return response;
  },
};
