import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-get-bulk-operation",
  name: "Get Bulk Operation",
  description: "Retrieve a bulk operation by ID to check its progress or get its results."
    + " Returns `status` (`CREATED`, `RUNNING`, `COMPLETED`, `FAILED`, `CANCELING`, `CANCELED`, or `EXPIRED`), `objectCount`, `errorCode` when failed, and, once `COMPLETED`, a `url` to download the results as a JSONL file (valid for 7 days)."
    + " Use after **Run Bulk Query** or **Run Bulk Mutation** returns an operation that has not finished yet."
    + " [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/bulkoperation)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    shopify,
    bulkOperationId: {
      type: "string",
      label: "Bulk Operation ID",
      description: "The GID of the bulk operation, e.g. `gid://shopify/BulkOperation/720918`. Returned as `id` by **Run Bulk Query** and **Run Bulk Mutation**.",
    },
  },
  async run({ $ }) {
    const { bulkOperation } = await this.shopify.getBulkOperation({
      id: this.bulkOperationId,
    });
    if (!bulkOperation) {
      throw new Error(`Bulk operation \`${this.bulkOperationId}\` not found`);
    }
    $.export("$summary", `Bulk operation \`${bulkOperation.id}\` is ${bulkOperation.status}`);
    return bulkOperation;
  },
};
