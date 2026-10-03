import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-merge-deals",
  name: "Merge Deals",
  description: "Merges two duplicate deals into one. The deal given as `Deal ID` is merged into the deal given as `Target Deal ID`."
    + " Use **List Deals** to find both IDs and **Get Deal** to confirm which one to keep. Example: `Deal ID` `1025`, `Target Deal ID` `1024`."
    + " The merge cannot be undone. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Deals#mergeDeals)",
  version: "0.0.11",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    pipedriveApp,
    dealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      description: "The ID of the deal to merge into the target, e.g. `1025`. Use **List Deals** to find it (the `id` field).",
      optional: false,
    },
    targetDealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      label: "Target Deal ID",
      description: "The ID of the deal to keep, e.g. `1024`. Must differ from `Deal ID`. Use **List Deals** to find it (the `id` field).",
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
