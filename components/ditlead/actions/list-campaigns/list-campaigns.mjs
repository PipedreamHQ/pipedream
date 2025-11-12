import ditlead from "../../ditlead.app.mjs";

export default {
  key: "ditlead-list-campaigns",
  name: "List Campaigns",
  description: "List campaigns in Ditlead. [See the documentation](https://ditlead.com/developer/api#tag/Campaign/paths/~1v1~1campaign/get)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ditlead,
  },
  async run({ $ }) {
    const { data } = await this.ditlead.listCampaigns({
      $,
    });

    $.export("$summary", `Successfully listed ${data.length} campaigns`);
    return data;
  },
};
