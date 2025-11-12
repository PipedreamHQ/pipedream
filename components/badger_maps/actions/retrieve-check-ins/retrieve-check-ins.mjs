import app from "../../badger_maps.app.mjs";

export default {
  key: "badger_maps-retrieve-check-ins",
  name: "Retrieve Check-Ins",
  description: "Retrieves check-ins. [See the docs](https://badgerupdatedapi.docs.apiary.io/#reference/check-ins/get-check-ins-for-account/retrieve-check-ins-for-an-account).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  async run({ $: step }) {
    const response = await this.app.listCheckIns({
      step,
      params: {
        customer_id: this.accountId,
      },
    });

    step.export("$summary", `Successfully retrieved ${response.length} check-in(s).`);

    return response;
  },
};
