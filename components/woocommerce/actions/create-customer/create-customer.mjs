import woocommerce from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-create-customer",
  name: "Create Customer",
  description: "Creates a new customer. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#create-a-customer)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    woocommerce,
    email: {
      propDefinition: [
        woocommerce,
        "email",
      ],
      description: "The email address for the customer.",
      optional: false,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Customer first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Customer last name.",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "Customer login name.",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "Customer password.",
      optional: true,
    },
    isPayingCustomer: {
      type: "boolean",
      label: "Is Paying Customer",
      description: "Is the customer a paying customer?",
      optional: true,
    },
  },
  methods: {
    createCustomer(data) {
      return this.woocommerce.postResource("customers", data);
    },
  },
  async run({ $ }) {
    const {
      email,
      firstName,
      lastName,
      username,
      password,
      isPayingCustomer,
    } = this;

    const res = await this.createCustomer({
      email,
      first_name: firstName,
      last_name: lastName,
      username,
      password,
      is_paying_customer: isPayingCustomer,
    });

    $.export("$summary", `Successfully created customer ID: ${res.id}`);

    return res;
  },
};
