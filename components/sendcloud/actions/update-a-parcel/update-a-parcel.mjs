import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-update-a-parcel",
  name: "Update a Parcel",
  description: "Updates a parcel under your API credentials. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/parcels/operations/update-a-parcel)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    parcelId: {
      propDefinition: [
        app,
        "parcelId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      optional: true,
    },
    address: {
      propDefinition: [
        app,
        "address",
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
    houseNumber: {
      propDefinition: [
        app,
        "houseNumber",
      ],
      optional: true,
    },
    postalCode: {
      propDefinition: [
        app,
        "postalCode",
      ],
      optional: true,
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.updateParcel({
      $,
      id: this.parcelId,
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

    $.export("$summary", `Successfully updated parcel with ID ${this.parcelId}`);

    return response;
  },
};
