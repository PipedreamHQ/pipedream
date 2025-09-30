import rejoiner from "../../rejoiner.app.mjs";

export default {
  key: "rejoiner-add-customer-to-list",
  name: "Add Customer to List",
  description: "Adds a customer to a specific list, or if the customer already exists, will update the record of that customer with the supplied data. [See the documentation](https://docs.rejoiner.com/reference/add-customer-to-list)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rejoiner,
    listId: {
      propDefinition: [
        rejoiner,
        "listId",
      ],
    },
    email: {
      propDefinition: [
        rejoiner,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        rejoiner,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        rejoiner,
        "lastName",
      ],
    },
    phone: {
      propDefinition: [
        rejoiner,
        "phone",
      ],
    },
    timezone: {
      propDefinition: [
        rejoiner,
        "timezone",
      ],
    },
    language: {
      propDefinition: [
        rejoiner,
        "language",
      ],
    },
    address1: {
      propDefinition: [
        rejoiner,
        "address1",
      ],
    },
    address2: {
      propDefinition: [
        rejoiner,
        "address2",
      ],
    },
    city: {
      propDefinition: [
        rejoiner,
        "city",
      ],
    },
    state: {
      propDefinition: [
        rejoiner,
        "state",
      ],
    },
    postalCode: {
      propDefinition: [
        rejoiner,
        "postalCode",
      ],
    },
    country: {
      propDefinition: [
        rejoiner,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rejoiner.addCustomerToList({
      $,
      listId: this.listId,
      data: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        phone: this.phone,
        timezone: this.timezone,
        language: this.language,
        address1: this.address1,
        address2: this.address2,
        city: this.city,
        state: this.state,
        postal_code: this.postalCode,
        country: this.country,
      },
    });
    $.export("$summary", `Added customer ${this.email} to list ${this.listId}`);
    return response;
  },
};
