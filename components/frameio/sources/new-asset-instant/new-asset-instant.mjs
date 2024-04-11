import frameio from "../../frameio.app.mjs";

export default {
  key: "frameio-new-asset-instant",
  name: "New Asset Instant",
  description: "Emit new event when an asset is uploaded.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    frameio,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    assetId: {
      propDefinition: [
        frameio,
        "assetId",
      ],
    },
  },
  hooks: {
    async activate() {
      // Placeholder for webhook subscription logic if required
    },
    async deactivate() {
      // Placeholder for webhook deletion logic if required
    },
  },
  async run(event) {
    const { body } = event;

    // Assuming the event structure contains an asset ID at `body.asset_id`
    // and this asset ID matches the configured `assetId` prop.
    if (!body || !body.asset_id || body.asset_id !== this.assetId) {
      this.http.respond({
        status: 404,
        body: "Asset not found or doesn't match the configured asset ID",
      });
      return;
    }

    const assetDetails = await this.frameio.getAssetDetails({
      assetId: this.assetId,
    });

    if (!assetDetails) {
      this.http.respond({
        status: 404,
        body: "Asset details not found",
      });
      return;
    }

    this.$emit(assetDetails, {
      id: assetDetails.id,
      summary: `New asset uploaded: ${assetDetails.name}`,
      ts: Date.parse(assetDetails.created_at),
    });

    this.http.respond({
      status: 200,
      body: "Event processed",
    });
  },
};
