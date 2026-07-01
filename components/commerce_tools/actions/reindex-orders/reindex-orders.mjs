import app from "../../commerce_tools.app.mjs";

export default {
  key: "commerce_tools-reindex-orders",
  name: "Reindex Orders",
  description: "Trigger a (re)build of the Order Search index for the Project. Required before the **Search Orders** action returns results - enabling Order Search with the **Change Order Search Status** action does not build the index on its own. [See the documentation](https://docs.commercetools.com/api/projects/order-search#check-if-order-search-index-exists).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.reindexOrders({
      $,
    });
    const {
      indexingJobId, existingIndexingJobId,
    } = response?.data?.reIndexAllOrders ?? {};
    const jobId = indexingJobId || existingIndexingJobId;
    $.export("$summary", jobId
      ? `Successfully started Order reindexing (job \`${jobId}\`)`
      : "Order reindexing request submitted");
    return response;
  },
};
