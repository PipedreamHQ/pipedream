import amazonSellingPartner from "../../amazon_selling_partner.app.mjs";

export default {
  key: "amazon_selling_partner-check-fba-inventory-levels",
  name: "Check FBA Inventory Levels",
  description: "Retrieves inventory summaries from Amazon fulfillment centers to monitor stock availability. [See the documentation](https://developer-docs.amazon.com/sp-api/reference/getinventorysummaries)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    amazonSellingPartner,
    marketplaceId: {
      propDefinition: [
        amazonSellingPartner,
        "marketplaceId",
      ],
    },
    details: {
      type: "boolean",
      label: "Details",
      description: "Set to `true` to return inventory summaries with additional summarized inventory details and quantities. Otherwise, returns inventory summaries only (default value).",
      optional: true,
    },
    startDateTime: {
      type: "string",
      label: "Start Date Time",
      description: "A start date and time in ISO8601 format. If specified, all inventory summaries that have changed since then are returned. You must specify a date and time that is no earlier than 18 months prior to the date and time when you call the API. Note: Changes in inboundWorkingQuantity, inboundShippedQuantity and inboundReceivingQuantity are not detected.",
      optional: true,
    },
    sellerSkus: {
      type: "string[]",
      label: "Seller SKUs",
      description: "A list of seller SKUs for which to return inventory summaries. You may specify up to 50 SKUs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { payload } = await this.amazonSellingPartner.getInventorySummaries({
      $,
      params: {
        marketplaceIds: this.marketplaceId,
        granularityType: "Marketplace",
        granularityId: this.marketplaceId,
        details: this.details,
        startDateTime: this.startDateTime,
        sellerSkus: this.sellerSkus?.length
          ? this.sellerSkus.join(",")
          : undefined,
      },
    });
    $.export("$summary", `Fetched ${payload.inventorySummaries.length} inventory summar${payload.inventorySummaries.length === 1
      ? "y"
      : "ies"}`);
    return payload.inventorySummaries || [];
  },
};
