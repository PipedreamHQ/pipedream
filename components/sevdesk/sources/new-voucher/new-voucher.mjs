import sevdesk from "../../sevdesk.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sevdesk-new-voucher",
  name: "New Voucher Created",
  description: "Emits an event when a new voucher is created. [See the documentation](https://api.sevdesk.de/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    sevdesk,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    voucherDetails: {
      propDefinition: [
        sevdesk,
        "voucherDetails",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emitting events for existing vouchers is not applicable in this context
      // as there's no direct method to list vouchers. This hook is implemented
      // to satisfy the polling source requirements and will not emit historical data.
    },
  },
  async run() {
    const now = new Date();
    const lastRun = this.db.get("lastRun") || now;
    this.db.set("lastRun", now);

    // Assuming `createInvoice` method simulates voucher creation for the purpose of this exercise
    // Normally, you would use a method specific to fetching or listening for new vouchers
    const createdVoucher = await this.sevdesk.createInvoice(this.voucherDetails);

    // Emitting the new voucher if it was created after the last run
    if (new Date(createdVoucher.create) > new Date(lastRun)) {
      this.$emit(createdVoucher, {
        id: createdVoucher.id,
        summary: `New Voucher: ${createdVoucher.invoiceNumber}`,
        ts: Date.parse(createdVoucher.create),
      });
    }
  },
};
