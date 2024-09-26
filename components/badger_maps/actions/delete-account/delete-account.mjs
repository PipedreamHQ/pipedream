import app from "../../badger_maps.app.mjs";

export default {
  key: "badger_maps-delete-account",
  name: "Delete Account",
  description: "Deletes an account. [See the docs](https://badgerupdatedapi.docs.apiary.io/#reference/accounts/retrieve-and-update-account-details/delete-customer).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
  },
  methods: {
    deleteAccount({
      accountId, ...args
    } = {}) {
      return this.app.delete({
        path: `/customers/${accountId}/`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      deleteAccount,
      accountId,
    } = this;

    const response = await deleteAccount({
      step,
      accountId,
    });

    step.export("$summary", `Successfully deleted account with ID ${accountId}.`);

    return response || {
      success: true,
    };
  },
};
