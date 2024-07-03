import { axios } from "@pipedream/platform";
import deftship from "../../deftship.app.mjs";

export default {
  key: "deftship-new-freight-shipment-instant",
  name: "New Freight Shipment Instant",
  description: "Emits an event when a new freight shipment is created",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    deftship,
    freightShipmentId: {
      propDefinition: [
        deftship,
        "freightShipmentId",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const freightShipment = await this.deftship.getFreightShipment({
        freightShipmentId: this.freightShipmentId,
      });
      this.$emit(freightShipment, {
        id: freightShipment.id,
        summary: `New freight shipment: ${freightShipment.id}`,
        ts: Date.now(),
      });
    },
  },
  async run() {
    const freightShipment = await this.deftship.getFreightShipment({
      freightShipmentId: this.freightShipmentId,
    });
    const lastFreightShipmentId = this.db.get("lastFreightShipmentId");
    if (freightShipment.id !== lastFreightShipmentId) {
      this.$emit(freightShipment, {
        id: freightShipment.id,
        summary: `New freight shipment: ${freightShipment.id}`,
        ts: Date.now(),
      });
      this.db.set("lastFreightShipmentId", freightShipment.id);
    }
  },
};
