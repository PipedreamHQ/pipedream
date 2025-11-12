import addressfinder from "../../addressfinder.app.mjs";

export default {
  key: "addressfinder-verify-address-au",
  name: "Verify Australian Address",
  description: "Validates an Australian address. [See the documentation](https://addressfinder.com.au/api/au/address/verification/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    addressfinder,
    address: {
      type: "string",
      label: "Address",
      description: "The Australian address to be verified, e.g. `30 Hoipo Road, SOMERSBY NSW`",
    },
    database: {
      type: "string[]",
      label: "Database(s)",
      description: "Which database(s) to return data from",
      options: [
        {
          value: "gnaf",
          label: "Return physical addresses from the GNAF database.",
        },
        {
          value: "paf",
          label: "Return postal addresses from the PAF database.",
        },
      ],
    },
    gps: {
      type: "boolean",
      label: "GPS Coordinates",
      description: "Return GPS coordinates from the datasource specified (when available)",
      optional: true,
    },
    extended: {
      type: "boolean",
      label: "Extended",
      description: "Returns extended information from the GNAF database",
      optional: true,
    },
    domain: {
      propDefinition: [
        addressfinder,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const {
      address, database, domain,
    } = this;
    const response = await this.addressfinder.verifyAustralianAddress({
      $,
      params: {
        q: address,
        ...(database?.includes?.("gnaf") && {
          gnaf: 1,
        }),
        ...(database?.includes?.("paf") && {
          paf: 1,
        }),
        ...(this.gps && {
          gps: 1,
        }),
        ...(this.extended && {
          extended: 1,
        }),
        domain,
      },
    });

    $.export("$summary", `Successfully verified AU address "${address}"`);
    return response;
  },
};
