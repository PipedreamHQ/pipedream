import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-merge-deals",
  name: "Merge Deals",
  description: "Merge two deals in Pipedrive. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Deals#mergeDeals)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedriveApp,
    dealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      description: "The ID of the deal to merge",
      optional: false,
    },
    targetDealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      label: "Target Deal ID",
      description: "The ID of the deal that the deal will be merged with",
      optional: false,
    },
  },
  methods: {
    mergeDeals({
      id, ...opts
    }) {
      const dealsApi = this.pipedriveApp.api("DealsApi");
      return dealsApi.mergeDeals({
        id,
        MergeDealsRequest: opts,
      });
    },
  },
  async run({ $ }) {
    const { data } = await this.mergeDeals({
      id: this.dealId,
      merge_with_id: this.targetDealId,
    });

    $.export("$summary", `Successfully merged deals with IDs ${this.dealId} and ${this.targetDealId}`);

    return data;
  },
};
