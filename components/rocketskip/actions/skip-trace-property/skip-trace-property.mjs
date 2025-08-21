import app from "../../rocketskip.app.mjs";

export default {
  key: "rocketskip-skip-trace-property",
  name: "Skip Trace Property",
  description: "Send a property to get phone numbers for the property owner. [See the documentation](https://docs.rocketskip.com/api-reference/endpoint/post)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    streetAddress: {
      propDefinition: [
        app,
        "streetAddress",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    state: {
      propDefinition: [
        app,
        "state",
      ],
    },
    zipCode: {
      propDefinition: [
        app,
        "zipCode",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.skipTraceProperty({
      $,
      data: {
        street_address: this.streetAddress,
        city: this.city,
        state: this.state,
        zip_code: this.zipCode,
        first_name: this.firstName,
        last_name: this.lastName,
      },
    });
    $.export("$summary", "Successfully sent the request and retrieved " + response.result.length + " resultts");
    return response;
  },
};
