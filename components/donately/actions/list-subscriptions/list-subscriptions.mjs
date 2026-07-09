import donately from "../../donately.app.mjs";

export default {
  key: "donately-list-subscriptions",
  name: "List Subscriptions",
  description: "List subscriptions for an account. [See the documentation](https://developer.donate.ly/api/#subscriptions)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  props: {
    donately,
    accountId: {
      propDefinition: [
        donately,
        "accountId",
      ],
    },
    limit: {
      propDefinition: [
        donately,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        donately,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.donately.listSubscriptions({
      $,
      params: {
        account_id: this.accountId,
      },
    });
    const count = response?.data?.length ?? 0;
    $.export("$summary", `Found ${count} subscription${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
