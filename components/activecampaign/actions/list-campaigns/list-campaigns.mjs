import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-list-campaigns",
  name: "List Campaigns",
  description: "List Campaigns. See the docs [here](https://developers.activecampaign.com/reference#list-all-campaigns).",
  type: "action",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    activecampaign,
  },
  async run({ $ }) {
    let resources = [];
    let offset = 0;
    let total = 1;

    do {
      const response =
        await this.activecampaign.paginateResources({
          requestFn: this.activecampaign.listCampaigns,
          requestArgs: {
            $,
            params: {
              offset,
            },
          },
          resourceName: "campaigns",
          mapper: (resource) => resource,
        });

      const { options: nextResources } = response;
      ({
        offset, total,
      } = response.context);

      resources = resources.concat(nextResources);

    } while (resources.length < total);

    $.export("$summary", `Successfully listed ${resources.length} campaigns.`);

    return resources;
  },
};
