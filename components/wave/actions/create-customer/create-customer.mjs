import app from "../../wave.app.mjs";

export default {
  type: "action",
  key: "wave-create-customer",
  name: "Create Customer",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a customer under a business. [See the documentation](https://developer.waveapps.com/hc/en-us/articles/360032569232-Mutation-Create-customer)",
  props: {
    app,
    businessId: {
      propDefinition: [
        app,
        "businessId",
      ],
      description: "The ID of the business to create the customer under.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the customer.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the customer.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer.",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency code of the customer.",
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the customer.",
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the customer.",
    },
    provinceCode: {
      type: "string",
      label: "Province Code",
      description: "The province code of the customer.",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The country code of the customer.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer.",
    },
  },
  async run({ $ }) {
    const {
      app,
      city,
      postalCode,
      provinceCode,
      countryCode,
      ...rest
    } = this;
    const data = {
      address: {
        city,
        postalCode,
        provinceCode,
        countryCode,
      },
      ...rest,
    };
    const res = await app.createCustomer(data);
    if (!res.data.customerCreate?.customer?.id) {
      throw new Error(`Failed to create customer: ${JSON.stringify(res)}`);
    }

    $.export("summary", `Customer successfully created with id "${res.data.customerCreate.customer.id}"`);
    return res;
  },
};
