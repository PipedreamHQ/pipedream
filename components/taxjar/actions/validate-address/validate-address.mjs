import app from "../../taxjar.app.mjs";

export default {
  key: "taxjar-validate-address",
  name: "Validate Address",
  description: "Validates a customer address and returns back a collection of address matches. [See the documentation](https://developers.taxjar.com/api/reference/#post-validate-an-address)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    country: {
      propDefinition: [
        app,
        "country",
      ],
      description: "The two-letter ISO country code, i.e.: `US`. At this time only US addresses can be validated",
      optional: true,
    },
    state: {
      propDefinition: [
        app,
        "state",
      ],
      optional: true,
    },
    zip: {
      propDefinition: [
        app,
        "zip",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
      optional: true,
    },
    street: {
      propDefinition: [
        app,
        "street",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.validateAddress({
      $,
      data: {
        country: this.country,
        state: this.state,
        zip: this.zip,
        city: this.city,
        street: this.street,
      },
    });
    $.export("$summary", `Successfully sent the request and found ${response.addresses.length} address matches`);
    return response;
  },
};
