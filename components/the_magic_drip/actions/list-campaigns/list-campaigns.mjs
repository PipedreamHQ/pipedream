import app from "../../the_magic_drip.app.mjs";

export default {
  key: "the_magic_drip-list-campaigns",
  name: "List Campaigns",
  description: "Retrieve all available campaigns. [See the documentation](https://docs.themagicdrip.com/api-reference/endpoint/get-v1campaign)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const { campaigns } = await this.app.listCampaigns({
      $,
    });
    $.export("$summary", `Sucessfully retrieved ${campaigns?.length ?? 0} campaigns`);
    return campaigns;
  },
};
