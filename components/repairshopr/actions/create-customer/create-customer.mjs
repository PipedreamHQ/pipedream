import app from "../../repairshopr.app.mjs";

export default {
  key: "repairshopr-create-customer",
  name: "Create Customer",
  description: "Create a new customer. [See the docs here](https://api-docs.repairshopr.com/#/Customer/post_customers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    businessName: {
      propDefinition: [
        app,
        "businessName",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    mobile: {
      propDefinition: [
        app,
        "mobile",
      ],
    },
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
    address2: {
      propDefinition: [
        app,
        "address2",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    state: {
      propDefinition: [
        app,
        "state",
      ],
    },
    zip: {
      propDefinition: [
        app,
        "zip",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      business_name: this.businessName,
      firstname: this.firstName,
      lastname: this.lastName,
      email: this.email,
      phone: this.phone,
      mobile: this.mobile,
      address: this.address,
      address2: this.address2,
      city: this.city,
      state: this.state,
      zip: this.zip,
    };
    const res = await this.app.createCustomer(data, $);
    $.export("$summary", "Customer successfully created");
    return res?.customer;
  },
};
