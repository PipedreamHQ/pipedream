import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import imagga from "../../imagga.app.mjs";

export default {
  key: "imagga-new-batch-processed",
  name: "New Batch Processed",
  description: "Emit new event when a batch of images has been processed for categorization, tagging, or color extraction.",
  version: "0.0.1",
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
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run() {
    const ticket = await this.imagga.getTicket({
      ticketId: this.ticketId,
    });

    if (ticket.result.is_final) {
      this.$emit(ticket, {
        id: this.ticketId,
        summary: `Batch of the ticket with Id: ${this.ticketId} was processed!`,
        ts: Date.now(),
      });
    }
  },
};
