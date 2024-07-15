import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ramp-transfer-payment-updated",
  name: "Transfer Payment Updated",
  description: "Emit new event when the status of a transfer payment changes",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    transferStatus: {
      propDefinition: [
        common.props.ramp,
        "transferStatus",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.ramp.listTransfers;
    },
    getParams() {
      return {
        status: this.transferStatus,
      };
    },
    generateMeta(transfer) {
      const ts = Date.now();
      return {
        id: `${transfer.id}-${ts}`,
        summary: `Status updated for transfer ID: ${transfer.id}`,
        ts,
      };
    },
    emitResults(results, max) {
      const previousStatuses = this._getPreviousStatuses();
      let transfers = [];
      for (const transfer of results) {
        if (previousStatuses[transfer.id] && previousStatuses[transfer.id] !== transfer.status) {
          transfers.push(transfer);
        }
        previousStatuses[transfer.id] = transfer.status;
      }
      this._setPreviousStatuses(previousStatuses);
      if (!transfers.length) {
        return;
      }
      if (max && transfers.length > max) {
        transfers = transfers.slice(-1 * max);
      }
      transfers.reverse().forEach((transfer) => {
        const meta = this.generateMeta(transfer);
        this.$emit(transfer, meta);
      });
    },
  },
  sampleEmit,
};
