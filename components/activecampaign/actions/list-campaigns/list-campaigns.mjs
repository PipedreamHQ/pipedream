import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-list-campaigns",
  name: "List Campaigns",
  description: "List Campaigns. See the docs [here](https://developers.activecampaign.com/reference#list-all-campaigns).",
  type: "action",
  version: "0.0.3",
  props: {
    activecampaign,
  },
  async run({ $ }) {
    let resources = [];
    let nextResources = [];
    const prevContext = {
      offset: 0,
    };

    do {
      ({ options: nextResources } =
        await this.activecampaign.paginateResources({
          requestFn: this.activecampaign.listCampaigns,
          requestArgs: {
            offset: prevContext.offset || 0,
          },
          resourceName: "campaigns",
          mapper: (resource) => resource,
        }));

      resources = resources.concat(nextResources);
      console.log(resources);

    } while (nextResources.length > 0);

    $.export("$summary", `Successfully listed ${resources.length} campaigns.`);

    return resources;
  },
};
