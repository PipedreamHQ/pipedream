import amazonSellingPartner from "../../amazon_selling_partner.app.mjs";

export default {
  key: "amazon_selling_partner-list-inbound-shipments",
  name: "List Inbound Shipments",
  description: "Fetches inbound shipment details to track stock movement and replenishment. [See the documentation](https://developer-docs.amazon.com/sp-api/reference/getshipments)",
  version: "0.0.2",
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
    status: {
      propDefinition: [
        amazonSellingPartner,
        "status",
      ],
    },
    lastUpdatedAfter: {
      type: "string",
      label: "Last Updated After",
      description: "A date used for selecting inbound shipments that were last updated after (or at) a specified time. The selection includes updates made by Amazon and by the seller.",
      optional: true,
    },
    lastUpdatedBefore: {
      type: "string",
      label: "Last Updated Before",
      description: "A date used for selecting inbound shipments that were last updated before (or at) a specified time. The selection includes updates made by Amazon and by the seller.",
      optional: true,
    },
  },
  async run({ $ }) {
    const shipments = await this.amazonSellingPartner.getPaginatedResources({
      fn: this.amazonSellingPartner.listInboundShipments,
      params: {
        MarketplaceId: this.marketplaceId,
        ShipmentStatusList: this.status?.length
          ? this.status.join(",")
          : undefined,
        LastUpdatedAfter: this.lastUpdatedAfter,
        LastUpdatedBefore: this.lastUpdatedBefore,
      },
      resourceKey: "ShipmentData",
    });
    $.export("$summary", `Fetched ${shipments.length} shipment${shipments.length === 1
      ? ""
      : "s"}`);
    return shipments;
  },
};
