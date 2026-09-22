import app from "../../microsoft_bookings.app.mjs";

export default {
  key: "microsoft_bookings-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in a Microsoft Bookings business. [See the documentation](https://learn.microsoft.com/en-us/graph/api/bookingbusiness-post-customers?view=graph-rest-1.0)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    businessId: {
      propDefinition: [
        app,
        "businessId",
      ],
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The customer's name",
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The customer's email address",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The customer's phone number",
      optional: true,
    },
    phoneType: {
      type: "string",
      label: "Phone Type",
      description: "The type of phone number",
      optional: true,
      options: [
        "home",
        "business",
        "mobile",
      ],
      default: "home",
    },
    street: {
      type: "string",
      label: "Street",
      description: "The street address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code",
      optional: true,
    },
    countryOrRegion: {
      type: "string",
      label: "Country or Region",
      description: "The country or region",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      businessId,
      displayName,
      emailAddress,
      phoneNumber,
      phoneType,
      street,
      city,
      state,
      postalCode,
      countryOrRegion,
    } = this;

    const content = {
      "@odata.type": "#microsoft.graph.bookingCustomer",
      displayName,
      emailAddress,
    };

    if (phoneNumber) {
      content.phones = [
        {
          number: phoneNumber,
          type: phoneType || "home",
        },
      ];
    }

    const address = {};
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (postalCode) address.postalCode = postalCode;
    if (countryOrRegion) address.countryOrRegion = countryOrRegion;

    if (Object.keys(address).length > 0) {
      address.type = "home";
      content.addresses = [
        address,
      ];
    }

    const response = await app.createCustomer({
      businessId,
      content,
    });

    $.export("$summary", `Successfully created customer: ${displayName}`);

    return response;
  },
};
