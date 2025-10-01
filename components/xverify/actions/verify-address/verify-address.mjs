import app from "../../xverify.app.mjs";

export default {
  key: "xverify-verify-address",
  name: "Verify Address",
  description: "Sends an address verification request. [See the documentation](https://apidocs.xverify.com/#address-verification-api-endpoint).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "**Note**: The `city`, `state`, and `zip` fields are optional. However, you must provide at least one of these fields to verify an address. If you provide all three fields, the API will use the city and state to verify the address.",
    },
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
    address1: {
      type: "string",
      label: "Street Address 1",
      description: "The street address to be verified.",
    },
    address2: {
      type: "string",
      label: "Street Address 2",
      description: "The second line of the street address to be verified.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the address to be verified.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the address to be verified.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip Code",
      description: "The postal code of the address to be verified. **Required** if city and state are not provided.",
      optional: true,
    },
    urbanization: {
      type: "string",
      label: "Urbanization",
      description: "A component of certain addresses in Puerto Rico.",
      optional: true,
    },
    parse: {
      type: "boolean",
      label: "Parse Address",
      description: "Set to `true` if you want the street address to be parsed into individual elements in the response.",
      optional: true,
    },
    aff: {
      propDefinition: [
        app,
        "aff",
      ],
    },
    subaff: {
      propDefinition: [
        app,
        "subaff",
      ],
    },
  },
  methods: {
    verifyAddress(args = {}) {
      return this.app._makeRequest({
        path: "/av",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      verifyAddress,
      domain,
      address1,
      address2,
      city,
      state,
      zip,
      urbanization,
      parse,
      aff,
      subaff,
    } = this;

    const response = await verifyAddress({
      $,
      params: {
        domain,
        address1,
        address2,
        city,
        state,
        zip,
        urbanization,
        parse,
        aff,
        subaff,
      },
    });

    $.export("$summary", `Successfully sent address verification request with status \`${response.status}\`.`);
    return response;
  },
};
