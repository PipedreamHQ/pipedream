import app from "../../badger_maps.app.mjs";

export default {
  key: "badger_maps-get-account",
  name: "Get Account",
  description: "Gets an account. [See the docs](https://badgerupdatedapi.docs.apiary.io/#reference/accounts/retrieve-and-update-account-details/retrieve-account-details).",
  type: "action",
  version: "0.0.2",
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
  },
  methods: {
    getAccount({
      accountId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/customers/${accountId}/`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.getAccount({
      step,
      accountId: this.accountId,
    });

    step.export("$summary", `Successfully retrieved account with ID \`${response.id}\``);

    return response;
  },
};
