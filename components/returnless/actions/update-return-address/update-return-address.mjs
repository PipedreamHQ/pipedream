import app from "../../returnless.app.mjs";

export default {
  key: "returnless-update-return-address",
  name: "Update Return Address",
  description: "Update a return address. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/bdf8070b84150-update-a-return-address)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    returnAddressId: {
      propDefinition: [
        app,
        "returnAddressId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the return address",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name of the return address",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "The street of the return address",
      optional: true,
    },
    houseNumber: {
      type: "string",
      label: "House Number",
      description: "The house number of the return address",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the return address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the return address",
      optional: true,
    },
    latitude: {
      type: "string",
      label: "Latitude",
      description: "The latitude of the return address",
      optional: true,
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "The longitude of the return address",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      returnAddressId,
      name,
      companyName,
      street,
      houseNumber,
      postalCode,
      city,
      latitude,
      longitude,
    } = this;

    const { data: response } = await this.app.updateReturnAddress({
      $,
      returnAddressId,
      data: {
        name,
        company_name: companyName,
        street,
        house_number: houseNumber,
        postal_code: postalCode,
        city,
        latitude,
        longitude,
      },
    });

    $.export("$summary", `Successfully updated return address ${this.returnAddressId}`);
    return response;
  },
};
