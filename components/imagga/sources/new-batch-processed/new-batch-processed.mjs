import { axios } from "@pipedream/platform";
import imagga from "../../imagga.app.mjs";

export default {
  key: "imagga-new-batch-processed",
  name: "New Batch Processed",
  description: "Emits an event when a batch of images has been processed for categorization, tagging, or color extraction. [See the documentation](https://docs.imagga.com)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    imagga,
    db: "$.service.db",
    ticketId: {
      propDefinition: [
        imagga,
        "ticketId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getTicketId() {
      return this.db.get("ticketId");
    },
    _setTicketId(ticketId) {
      this.db.set("ticketId", ticketId);
    },
    _emitBatchStatus(batchStatus, ticketId) {
      const ts = batchStatus.updated_at
        ? Date.parse(batchStatus.updated_at)
        : Date.now();
      this.$emit(batchStatus, {
        id: batchStatus.id,
        summary: `Batch ${ticketId} processed`,
        ts,
      });
    },
  },
  hooks: {
    async deploy() {
      const ticketId = this._getTicketId();
      if (ticketId) {
        const batchStatus = await this.imagga._makeRequest({
          method: "GET",
          path: `/batches/${ticketId}`,
        });

        if (batchStatus.status === "completed") {
          this._emitBatchStatus(batchStatus, ticketId);
        }
      }
    },
  },
  async run() {
    const ticketId = this._getTicketId();
    if (!ticketId) throw new Error("No ticket ID found. Please make sure to setup the source with a valid ticket ID.");

    const batchStatus = await this.imagga._makeRequest({
      method: "GET",
      path: `/batches/${ticketId}`,
    });

    if (batchStatus.status === "completed") {
      this._emitBatchStatus(batchStatus, ticketId);
      this._setTicketId(null); // Reset ticket ID after successful emit
    }
  },
};
