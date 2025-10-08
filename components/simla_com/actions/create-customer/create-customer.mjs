import app from "../../simla_com.app.mjs";

export default {
  key: "simla_com-create-customer",
  name: "Create Customer",
  description: "Creates a new customer profile. [See the documentation](https://docs.simla.com/Developers/API/APIVersions/APIv5#post--api-v5-customers-create).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The name of the customer.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the customer.",
      optional: true,
    },
    phones: {
      type: "string[]",
      label: "Phone Numbers",
      description: "The phone numbers of the customer.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the customer.",
      optional: true,
    },
    countryIso: {
      optional: true,
      propDefinition: [
        app,
        "countryIso",
      ],
    },
    region: {
      type: "string",
      label: "Region",
      description: "The region of the customer.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the customer.",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "The street of the customer.",
      optional: true,
    },
  },
  methods: {
    createCustomer(args = {}) {
      return this.app.post({
        path: "/customers/create",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createCustomer,
      firstName,
      lastName,
      phones,
      email,
      postalCode,
      countryIso,
      region,
      city,
      street,
    } = this;

    const response = await createCustomer({
      $,
      data: {
        customer: JSON.stringify({
          firstName,
          lastName,
          email,
          address: {
            index: postalCode,
            countryIso,
            region,
            city,
            street,
          },
          ...(phones?.length && {
            phones: phones.map((number) => ({
              number,
            })),
          }),
        }),
      },
    });

    $.export("$summary", `Successfully created customer with ID \`${response.id}\`.`);

    return response;
  },
};
