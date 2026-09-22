import pitchlane from "../../pitchlane.app.mjs";

export default {
  key: "pitchlane-list-campaigns",
  name: "List Campaigns",
  description: "Lists all campaigns. [See the documentation](https://docs.pitchlane.com/reference#tag/campaigns/GET/campaigns)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pitchlane,
  },
  async run({ $ }) {
    const response = await this.pitchlane.listCampaigns({
      $,
    });
    $.export("$summary", `Successfully listed ${response?.length} campaign${response?.length === 1
      ? ""
      : "s"}.`);
    return response;
  },
};
