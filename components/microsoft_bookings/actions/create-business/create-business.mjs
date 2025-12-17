import app from "../../microsoft_bookings.app.mjs";

export default {
  key: "microsoft_bookings-create-business",
  name: "Create Booking Business",
  description: "Creates a new Microsoft Bookings business. [See the documentation](https://learn.microsoft.com/en-us/graph/api/bookingbusiness-post-bookingbusinesses?view=graph-rest-1.0)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The name of the business, which interfaces with customers",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address for the business",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The telephone number for the business",
      optional: true,
    },
    webSiteUrl: {
      type: "string",
      label: "Website URL",
      description: "The URL of the business web site",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "The street address of the business",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the business",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the business",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the business",
      optional: true,
    },
    countryOrRegion: {
      type: "string",
      label: "Country or Region",
      description: "The country or region of the business",
      optional: true,
    },
    defaultCurrencyIso: {
      type: "string",
      label: "Default Currency",
      description: "The code for the currency that the business operates in (e.g. USD)",
      optional: true,
    },
    businessType: {
      type: "string",
      label: "Business Type",
      description: "The type of business",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      displayName,
      email,
      phone,
      webSiteUrl,
      street,
      city,
      state,
      postalCode,
      countryOrRegion,
      defaultCurrencyIso,
      businessType,
    } = this;

    const address = {};
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (postalCode) address.postalCode = postalCode;
    if (countryOrRegion) address.countryOrRegion = countryOrRegion;

    const content = {
      displayName,
    };

    if (email) content.email = email;
    if (phone) content.phone = phone;
    if (webSiteUrl) content.webSiteUrl = webSiteUrl;
    if (Object.keys(address).length > 0) content.address = address;
    if (defaultCurrencyIso) content.defaultCurrencyIso = defaultCurrencyIso;
    if (businessType) content.businessType = businessType;

    const response = await app.createBusiness({
      content,
    });

    $.export("$summary", `Successfully created business: ${displayName}`);

    return response;
  },
};
