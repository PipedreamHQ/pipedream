import piloterr from "../../piloterr.app.mjs";

export default {
  key: "piloterr-get-ebay-listing",
  name: "Get eBay Listing",
  description: "Get one eBay listing with its price, condition, availability, seller, shipping, returns and item specifics. [See the documentation](https://docs.piloterr.com/v2/api-reference/ebay/product)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    piloterr,
    item: {
      type: "string",
      label: "Item ID Or URL",
      description: "The eBay item ID or listing URL, e.g. `257758922911`. Use **eBay Search** to find it (the `item_id` field).",
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.getEbayListing({
      $,
      params: {
        query: this.item,
      },
    });
    $.export("$summary", `Retrieved eBay listing ${response.item_id ?? this.item}`);
    return response;
  },
};
