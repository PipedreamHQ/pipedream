# Overview

**Calculate Marketplace Fees** computes seller fees, profit, margin, break even price and the price you need for a target margin on Etsy, eBay and Amazon (FBA or FBM).

The action runs the Apify Actor `vncntlabs/shoptrueprofit-fee-mcp`. One calculation is a tool plus an arguments object. A batch is a list of calls. Each successful calculation is one dataset row, with an itemized fee breakdown, the assumptions used, the fee table version and links to the source pages.

Percent fields are percents: `8.25` means 8.25%, not 0.0825. Money is in dollars, with up to 2 decimals (`24.99` means $24.99). Etsy money is in the shop region currency (US dollars for region `us`).

# Example Use Cases

- See what Etsy, eBay and Amazon each take from the same price and cost.
- Check profit and margin for one order, including your item cost and shipping label.
- Find the lowest price that breaks even, or that hits a target margin.
- Look up category ids and Etsy region ids before you calculate.

# Getting Started

1. Connect an Apify account in Pipedream. Create the API token in the Apify Console under Settings, then Integrations. See [Apify API tokens](https://docs.apify.com/platform/integrations/api).
2. Add **Calculate Marketplace Fees** to a workflow.
3. Pick a tool, or pass a batch of calls. For a three-way comparison, use tool `compare_marketplaces` and arguments like:

```json
{
  "price": 29.99,
  "shipping_charged": 5,
  "item_cost": 9,
  "shipping_label_cost": 4.5,
  "target_margin_pct": 30,
  "amazon": {
    "category": "home-kitchen",
    "fulfillment": "fba",
    "length_in": 10,
    "width_in": 6,
    "height_in": 3,
    "weight_lb": 1.2,
    "inbound_cost": 0.5
  }
}
```

List tools (`list_ebay_categories`, `list_amazon_categories`, `list_etsy_regions`) take no arguments and are not charged. Use them to look up category and region ids.

Amazon category ids look like `home-kitchen`. eBay category ids look like `most`. Etsy region ids look like `us`.

# Troubleshooting

- **The Actor rejected the input.** The error names the field. Unknown fields are not silently dropped. Amazon tools need `category` and `fulfillment`. FBA also needs `length_in`, `width_in`, `height_in` and `weight_lb`. Shipping the buyer pays must be `0` or omitted for FBA, because Amazon sets that shipping.
- **A category or region was rejected.** Those ids are short codes, not display names. Run the matching list tool in this action to see the accepted values.
- **The target margin is impossible.** Target price tools return the highest margin that can be reached when the target cannot.
- **The run timed out.** The synchronous wait ends at about 300 seconds. A batch can hold up to 1,000 calls. Split a larger batch.
- **Authentication failed.** Reconnect the Apify account with a new API token.
