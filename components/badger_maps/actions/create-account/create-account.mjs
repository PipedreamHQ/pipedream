import app from "../../badger_maps.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "badger_maps-create-account",
  name: "Create Account",
  description: "Creates an account. [See the docs](https://badgerupdatedapi.docs.apiary.io/#reference/accounts/list-and-create-accounts/create-new-account).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
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
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
  },
  methods: {
    createAccount(args = {}) {
      return this.app.create({
        path: "/customers/",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      firstName,
      lastName,
      address,
      phoneNumber,
      email,
    } = this;

    const data = utils.reduceProperties({
      initialProps: {
        email,
        last_name: lastName,
        address,
      },
      additionalProps: {
        first_name: firstName,
        phone_number: phoneNumber,
      },
    });

    const response = await this.createAccount({
      step,
      data,
    });

    step.export("$summary", `Successfully created account with ID \`${response.customer.id}\``);

    return response;
  },
};
