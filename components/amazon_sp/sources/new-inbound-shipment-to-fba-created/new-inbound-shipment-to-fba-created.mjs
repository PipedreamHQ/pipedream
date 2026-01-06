import common from "../common/base.mjs";

export default {
  ...common,
  key: "amazon_sp-new-inbound-shipment-to-fba-created",
  name: "New Inbound Shipment to FBA Created",
  description: "Emit new event when a new inbound shipment to FBA is created. [See the documentation](https://developer-docs.amazon.com/sp-api/reference/getshipments)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    status: {
      propDefinition: [
        common.props.amazonSellingPartner,
        "status",
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(shipment) {
      return {
        id: shipment.ShipmentId,
        summary: `New Inbound Shipment: ${shipment.ShipmentId}`,
        ts: Date.parse(shipment.LastUpdatedDate),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const shipments = await this.amazonSellingPartner.getPaginatedResources({
      fn: this.amazonSellingPartner.listInboundShipments,
      params: {
        MarketplaceIds: this.marketplaceId,
        LastUpdatedAfter: lastTs,
        ShipmentStatusList: this.status?.length
          ? this.status.join(",")
          : undefined,
      },
      resourceKey: "ShipmentData",
    });

    if (!shipments?.length) {
      return;
    }

    for (const shipment of shipments) {
      if (Date.parse(shipment.LastUpdatedDate) > Date.parse(maxTs)) {
        maxTs = shipment.LastUpdatedDate;
      }
      const meta = this.generateMeta(shipment);
      this.$emit(shipment, meta);
    }

    this._setLastTs(maxTs);
  },
};
