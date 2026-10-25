import { ConfigurationError } from "@pipedream/platform";
import apify from "../../apify.app.mjs";
import {
  buildActorInput,
  formatCount,
  parseObject,
} from "../../common/utils.mjs";
import { runSyncGetDatasetItems } from "../../common/run-sync.mjs";

const MARKETPLACE_FEES_ACTOR_ID = "vncntlabs~shoptrueprofit-fee-mcp";

const FEE_TOOLS = [
  {
    label: "Compare Etsy, eBay and Amazon",
    value: "compare_marketplaces",
  },
  {
    label: "Etsy fees",
    value: "etsy_fees",
  },
  {
    label: "eBay fees",
    value: "ebay_fees",
  },
  {
    label: "Amazon fees",
    value: "amazon_fees",
  },
  {
    label: "Etsy profit and margin",
    value: "etsy_profit",
  },
  {
    label: "eBay profit and margin",
    value: "ebay_profit",
  },
  {
    label: "Amazon profit and margin",
    value: "amazon_profit",
  },
  {
    label: "Etsy price for a target margin",
    value: "etsy_target_price",
  },
  {
    label: "eBay price for a target margin",
    value: "ebay_target_price",
  },
  {
    label: "Amazon price for a target margin",
    value: "amazon_target_price",
  },
  {
    label: "List eBay categories",
    value: "list_ebay_categories",
  },
  {
    label: "List Amazon categories",
    value: "list_amazon_categories",
  },
  {
    label: "List Etsy regions",
    value: "list_etsy_regions",
  },
];

const COMPARE_EXAMPLE = "{\"price\":29.99,\"shipping_charged\":5,\"item_cost\":9,\"shipping_label_cost\":4.5,\"target_margin_pct\":30,\"amazon\":{\"category\":\"home-kitchen\",\"fulfillment\":\"fba\",\"length_in\":10,\"width_in\":6,\"height_in\":3,\"weight_lb\":1.2,\"inbound_cost\":0.5}}";

const CALL_EXAMPLE = "{\"tool\":\"etsy_profit\",\"arguments\":{\"price\":24.99,\"item_cost\":8,\"shipping_label_cost\":4.5}}";

const MAX_CALLS = 1000;

const parseToolArguments = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = parseObject(value);
  const isObject = parsed && typeof parsed === "object" && !Array.isArray(parsed);
  if (!isObject) {
    throw new ConfigurationError(`Arguments must be a JSON object. e.g. \`${COMPARE_EXAMPLE}\`.`);
  }

  return parsed;
};

const parseCalls = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = parseObject(value);
  const rows = [];
  if (Array.isArray(parsed)) {
    rows.push(...parsed);
  } else {
    rows.push(parsed);
  }

  const calls = [];
  for (const row of rows) {
    if (Array.isArray(row)) {
      calls.push(...row);
    } else {
      calls.push(row);
    }
  }

  if (calls.length > MAX_CALLS) {
    throw new ConfigurationError(`Calls must contain no more than ${MAX_CALLS} items.`);
  }

  for (const call of calls) {
    const isObject = call && typeof call === "object" && !Array.isArray(call);
    if (!isObject || typeof call.tool !== "string" || !call.tool) {
      throw new ConfigurationError(`Each call must be a JSON object with \`tool\`. e.g. \`${CALL_EXAMPLE}\`.`);
    }
  }

  return calls;
};

export default {
  key: "apify-calculate-marketplace-fees",
  name: "Calculate Marketplace Fees",
  description: "Calculate Etsy, eBay and Amazon FBA or FBM seller fees, profit, margin, break even price and the price for a target margin. Pass one calculation as a tool plus arguments, or many as calls. Use the list tools (`list_ebay_categories`, `list_amazon_categories`, `list_etsy_regions`) to look up category and region ids. Percent fields are percents (`8.25` means 8.25%) and money is in dollars. [See the documentation](https://apify.com/vncntlabs/shoptrueprofit-fee-mcp)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    apify,
    tool: {
      type: "string",
      label: "Tool",
      description: "Which calculation to run. Leave this empty when `calls` is set. List tools take no arguments and are not charged. e.g. `compare_marketplaces`.",
      optional: true,
      options: FEE_TOOLS,
    },
    toolArguments: {
      type: "string",
      label: "Arguments",
      description: `JSON object of arguments for \`tool\`, sent to the Actor as \`arguments\`. Most fee and profit tools need \`price\`. Amazon tools also need \`category\` and \`fulfillment\` (\`fba\` or \`fbm\`). FBA also needs \`length_in\`, \`width_in\`, \`height_in\` and \`weight_lb\`. Target-price tools need \`target_margin_pct\` (0 to 90). \`compare_marketplaces\` needs \`price\` and \`amazon\`. Percent fields are percents (\`8.25\` means 8.25%). Money is in dollars. e.g. \`${COMPARE_EXAMPLE}\`.`,
      optional: true,
    },
    calls: {
      type: "string[]",
      label: "Calls",
      description: `Batch of calculations, up to 1,000. Each entry is a JSON object with \`tool\` and \`arguments\`. When this is set, it is sent to the Actor as \`calls\`. e.g. \`${JSON.stringify([
        CALL_EXAMPLE,
      ])}\`.`,
      optional: true,
    },
  },
  async run({ $ }) {
    const toolArguments = parseToolArguments(this.toolArguments);
    const calls = parseCalls(this.calls);

    if (!this.tool && (!calls || calls.length === 0)) {
      throw new ConfigurationError("Provide a tool, or at least one call in the batch.");
    }

    const input = buildActorInput({
      tool: this.tool,
      arguments: toolArguments,
      calls,
    });
    const items = await runSyncGetDatasetItems(this.apify, {
      actorId: MARKETPLACE_FEES_ACTOR_ID,
      input,
    });

    $.export(
      "$summary",
      `Successfully calculated ${formatCount(items.length, "marketplace fee result", "marketplace fee results")}`,
    );
    return items;
  },
};
