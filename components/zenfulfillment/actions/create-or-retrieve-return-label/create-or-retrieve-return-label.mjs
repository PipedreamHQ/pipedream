import zenfulfillment from "../../zenfulfillment.app.mjs";

export default {
  key: "zenfulfillment-create-or-retrieve-return-label",
  name: "Create or Retrieve Return Label",
  description: "Create or retrieve a Return Label for a specific Order. [See the documentation](https://partner.alaiko.com/docs#tag/ReturnLabel/operation/api_partnerreturn-label_post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zenfulfillment,
    orderId: {
      propDefinition: [
        zenfulfillment,
        "orderId",
      ],
    },
    carrier: {
      type: "string",
      label: "Carrier",
      description: "Carrier for which to create the return label. Options: DHL, HERMES, EXPORTO",
      options: [
        "DHL",
        "HERMES",
        "EXPORTO",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the return recipient",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the return recipient",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the return recipient",
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company of the return recipient",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country of the return recipient",
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "Zip code of the return recipient",
    },
    region: {
      type: "string",
      label: "Region",
      description: "Region of the return recipient",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the return recipient",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "Street of the return recipient",
    },
    streetNumber: {
      type: "string",
      label: "Street Number",
      description: "Street number of the return recipient",
    },
    apartment: {
      type: "string",
      label: "Apartment",
      description: "Apartment of the return recipient",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zenfulfillment.createOrRetrieveReturnLabel({
      $,
      data: {
        orderId: this.orderId,
        carrier: this.carrier,
        returnAddress: {
          firstName: this.firstName,
          lastName: this.lastName,
          city: this.city,
          company: this.company,
          country: this.country,
          zip: this.zip,
          region: this.region,
          phone: this.phone,
          street: this.street,
          streetNumber: this.streetNumber,
          apartment: this.apartment,
        },
      },
    });
    $.export("$summary", `Successfully created or retrieved return label with ID: ${response.id}`);
    return response;
  },
};
