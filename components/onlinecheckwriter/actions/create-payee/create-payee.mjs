import app from "../../onlinecheckwriter.app.mjs";

export default {
  key: "onlinecheckwriter-create-payee",
  name: "Create Payee",
  description: "Registers a new payee within the system.[See the documentation](https://apiv3.onlinecheckwriter.com/#38a31300-bf13-4da1-ac97-dd81525b57b3)",
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
      type: "string",
      label: "Name",
      description: "The name of the payee.",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the payee.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the payee.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the payee.",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address 1",
      description: "The first line of the address of the payee.",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "The second line of the address of the payee.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the payee.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the payee.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the payee.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The zip code of the payee.",
      optional: true,
    },
  },
  methods: {
    createPayees(args = {}) {
      return this.app.post({
        path: "/payees",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createPayees,
      name,
      company,
      email,
      phone,
      address1,
      address2,
      country,
      state,
      city,
      zip,
    } = this;

    const response = await createPayees({
      $,
      data: {
        payees: [
          {
            name,
            company,
            email,
            phone,
            address1,
            address2,
            country,
            state,
            city,
            zip,
          },
        ],
      },
    });

    $.export("$summary", `Successfully created payee with ID \`${response.data.payees[0].payeeId}\`.`);
    return response;
  },
};
