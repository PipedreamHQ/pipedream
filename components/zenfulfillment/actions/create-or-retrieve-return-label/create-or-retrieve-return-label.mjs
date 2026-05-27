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
      description: "Shipping carrier for the return label. Must be one of the supported carriers: `DHL`, `HERMES`, or `EXPORTO`.",
      options: [
        "DHL",
        "HERMES",
        "EXPORTO",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the return recipient (e.g., `Jane`).",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the return recipient (e.g., `Doe`).",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the return recipient's address (e.g., `Berlin`).",
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company name at the return address, if applicable (e.g., `Acme GmbH`).",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "ISO 3166-1 alpha-2 country code for the return recipient's address (e.g., `DE` for Germany, `GB` for the United Kingdom, `US` for the United States).",
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "Postal/ZIP code for the return recipient's address. Format varies by country (e.g., `12345` for Germany, `SW1A 1AA` for the UK, `10001` for the US).",
    },
    region: {
      type: "string",
      label: "Region",
      description: "State, province, or region of the return recipient's address (e.g., `Bavaria`, `England`, `NY`).",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the return recipient in E.164 format, including country code (e.g., `+491701234567` for a German number, `+441234567890` for a UK number).",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "Street name of the return recipient's address, without the house number (e.g., `Hauptstraße`).",
    },
    streetNumber: {
      type: "string",
      label: "Street Number",
      description: "House or building number for the return recipient's address. May be numeric or alphanumeric (e.g., `12`, `12A`, `4B`).",
    },
    apartment: {
      type: "string",
      label: "Apartment",
      description: "Apartment, suite, or floor number at the return address, if applicable (e.g., `Apt 3`, `Floor 2`).",
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
