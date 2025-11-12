import app from "../../badger_maps.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "badger_maps-update-account",
  name: "Update Account",
  description: "Updates an account. [See the docs](https://badgerupdatedapi.docs.apiary.io/#reference/accounts/retrieve-and-update-account-details/update-account).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
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
      optional: true,
      propDefinition: [
        app,
        "lastName",
      ],
    },
    address: {
      optional: true,
      propDefinition: [
        app,
        "address",
      ],
    },
    phoneNumber: {
      optional: true,
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
  },
  methods: {
    updateAccount({
      accountId, ...args
    } = {}) {
      return this.app.patch({
        path: `/customers/${accountId}/`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      accountId,
      firstName,
      lastName,
      address,
      phoneNumber,
      email,
    } = this;

    const data = utils.reduceProperties({
      initialProps: {
        email,
      },
      additionalProps: {
        first_name: firstName,
        last_name: lastName,
        address,
        phone_number: phoneNumber,
      },
    });

    const response = await this.updateAccount({
      step,
      accountId,
      data,
    });

    step.export("$summary", `Successfully updated account with ID \`${response.id}\``);

    return response;
  },
};
