import app from "../../apollo_io.app.mjs";

export default {
  key: "apollo_io-update-account-stage",
  name: "Update Account Stage",
  description: "Updates the stage of one or more accounts in Apollo.io. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#update-account-stage)",
  type: "action",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    accountIds: {
      propDefinition: [
        app,
        "accountId",
      ],
      type: "string[]",
      label: "Account IDs",
      description: "Identifiers of the accounts to update",
    },
    accountStageId: {
      propDefinition: [
        app,
        "accountStageId",
      ],
    },
  },
  async run({ $ }) {
    const { accounts } = await this.app.updateAccountStage({
      $,
      data: {
        account_ids: this.accountIds,
        account_stage_id: this.accountStageId,
      },
    });

    $.export("$summary", `Successfully updated ${accounts.length} account${accounts.length === 1
      ? ""
      : "s"}.`);

    return accounts;
  },
};
