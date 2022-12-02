import app from "../../repairshopr.app.mjs";

export default {
  key: "repairshopr-create-customer",
  name: "Create Customer",
  description: "Create a new customer. [See the docs here](https://api-docs.repairshopr.com/#/Customer/post_customers)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    businessName: {
      type: "string",
      label: "Business Name",
      description: "The business name of the customer.",
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
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the customer.",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "The mobile number of the customer.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the customer.",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "The second address of the customer.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the customer.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the customer.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The zip code of the customer.",
      optional: true,
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
    $.export("$summary", "My action success");
    return res;
  },
};
