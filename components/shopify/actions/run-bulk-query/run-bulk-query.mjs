import shopify from "../../shopify.app.mjs";
import utils from "../../common/utils.mjs";
import {
  BULK_OPERATION_PENDING_STATUSES, BULK_OPERATION_POLL_INTERVAL_MS,
} from "../../common/constants.mjs";

export default {
  key: "shopify-run-bulk-query",
  name: "Run Bulk Query",
  description: "Start a bulk query that exports a large dataset (e.g. every order or product in the store) asynchronously, then wait up to **Max Wait Seconds** for it to finish."
    + " Returns the bulk operation: `status`, `objectCount`, and, once `COMPLETED`, a `url` to download the results as a JSONL file (one object per line, valid for 7 days). `url` is `null` when the query matched no objects."
    + " If the operation is still `CREATED` or `RUNNING` when the wait ends, call **Get Bulk Operation** with the returned `id` to check progress."
    + " Use **Run GraphQL Query** instead for small reads that fit in a few paginated pages."
    + " [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/bulkoperationrunquery)",
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
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    alert: {
      type: "alert",
      alertType: "info",
      content: "Use the Shopify trigger \"New Event Emitted (Instant)\" with event type `bulk_operations/finish` to be notified when long-running bulk queries complete",
    },
    query: {
      type: "string",
      label: "Query",
      description: "The Admin GraphQL query to run in bulk. It must include at least one connection field and supports up to five connections nested at most two levels deep; pagination arguments such as `first` are ignored and can be omitted. Example: `{ orders { edges { node { id name createdAt totalPriceSet { shopMoney { amount currencyCode } } } } } }`. [See the documentation](https://shopify.dev/docs/api/usage/bulk-operations/queries) for query limitations.",
    },
    groupObjects: {
      type: "boolean",
      label: "Group Objects",
      description: "Whether to nest child objects directly under their parent objects in the JSONL output, e.g. `true`. Grouping slows the operation and makes timeouts more likely, so enable it only if you depend on the grouped format. Defaults to `false`.",
      optional: true,
      default: false,
    },
    maxWaitSeconds: {
      type: "integer",
      label: "Max Wait Seconds",
      description: "How long to wait for the bulk operation to finish before returning its current status, e.g. `20`. Set to `0` to return immediately after starting it. Defaults to `20`.",
      optional: true,
      default: 20,
      min: 0,
      max: 600,
    },
  },
  async run({ $ }) {
    const {
      bulkOperationRunQuery: {
        bulkOperation: startedOperation, userErrors,
      },
    } = await this.shopify.runBulkQuery({
      query: this.query,
      groupObjects: this.groupObjects,
    });

    if (userErrors.length > 0) {
      throw new Error(userErrors[0].message);
    }

    let bulkOperation = startedOperation;
    const deadline = Date.now() + this.maxWaitSeconds * 1000;
    while (BULK_OPERATION_PENDING_STATUSES.includes(bulkOperation.status)
      && Date.now() + BULK_OPERATION_POLL_INTERVAL_MS <= deadline) {
      await utils.delay(BULK_OPERATION_POLL_INTERVAL_MS);
      ({ bulkOperation } = await this.shopify.getBulkOperation({
        id: bulkOperation.id,
      }));
    }

    if (bulkOperation.status === "FAILED") {
      throw new Error(`Bulk operation \`${bulkOperation.id}\` failed with error code \`${bulkOperation.errorCode}\``);
    }

    $.export("$summary", bulkOperation.status === "COMPLETED"
      ? `Successfully completed bulk query with ${bulkOperation.objectCount} object(s)`
      : `Bulk query \`${bulkOperation.id}\` is ${bulkOperation.status}`);
    return bulkOperation;
  },
};
