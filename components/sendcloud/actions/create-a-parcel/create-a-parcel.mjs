import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-create-a-parcel",
  name: "Create a Parcel",
  description: "Creates a new parcel under your Sendcloud API credentials. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/parcels/operations/create-a-parcel)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    houseNumber: {
      propDefinition: [
        app,
        "houseNumber",
      ],
    },
    postalCode: {
      propDefinition: [
        app,
        "postalCode",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createParcel({
      $,
      data: {
        parcel: {
          name: this.name,
          address: this.address,
          city: this.city,
          house_number: this.houseNumber,
          postal_code: this.postalCode,
          country: this.country,
        },
      },
    });

    $.export("$summary", `Successfully created parcel with ID: ${response.parcel.id}`);

    return response;
  },
};
