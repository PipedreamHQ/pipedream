import ringba from "../../ringba.app.mjs";

export default {
  key: "ringba-list-campaigns",
  name: "List Campaigns",
  description: "Retrieve all active campaigns for a Ringba account. See the [documentation](https://developers.ringba.com/).",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ringba,
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the Ringba account whose campaigns should be retrieved.",
    },
    includeStats: {
      type: "boolean",
      label: "Include Stats",
      description: "Whether to include campaign statistics in the response.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.ringba.listCampaigns({
      $,
      accountId: this.accountId,
      params: {
        includeStats: this.includeStats || undefined,
      },
    });

    const campaigns = Array.isArray(response)
      ? response
      : response?.campaigns;
    const count = campaigns?.length;

    $.export(
      "$summary",
      count === undefined
        ? `Successfully retrieved campaigns for account ${this.accountId}.`
        : `Successfully retrieved ${count} campaign${count === 1
          ? ""
          : "s"}.`,
    );

    return response;
  },
};
