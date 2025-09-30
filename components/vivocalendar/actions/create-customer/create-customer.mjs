import app from "../../vivocalendar.app.mjs";

export default {
  key: "vivocalendar-create-customer",
  name: "Create Customer",
  description: "Creates a new customer. [See the documentation](https://app.vivocalendar.com/api-docs/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "customerName",
      ],
    },
    email: {
      propDefinition: [
        app,
        "customerEmail",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "customerPhone",
      ],
      optional: true,
    },
    whatIsYourDOB: {
      propDefinition: [
        app,
        "customerBirthDate",
      ],
    },
    whatIsYourHobby: {
      propDefinition: [
        app,
        "customerHobby",
      ],
    },
  },
  methods: {
    createCustomer(args = {}) {
      return this.app.post({
        path: "/customers",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createCustomer,
      name,
      email,
      phone,
      whatIsYourDOB,
      whatIsYourHobby,
    } = this;

    const response = await createCustomer({
      $,
      data: {
        customer: {
          name,
          email,
          phone,
          What_is_your_DOB: whatIsYourDOB,
          What_is_your_hobby: whatIsYourHobby,
        },
      },
    });

    $.export("$summary", `Successfully created customer with ID \`${response?.response?.customer?.id}\``);
    return response;
  },
};
