import { createHash } from "crypto";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import virtualsms from "../../virtualsms.app.mjs";

export default {
  key: "virtualsms-new-sms-received",
  name: "New SMS Received",
  description: "Emit a new event for each SMS message received on any of your active rentals. Polls the VirtualSMS API on the configured interval (default 60s) and de-duplicates by order ID so each SMS is emitted exactly once. [See the documentation](https://virtualsms.io/docs/api-reference/introduction)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    virtualsms,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      // On deploy, mark currently-received SMS as already seen
      // so we only emit truly new messages going forward.
      const orders = await this.virtualsms.listOrders();
      const seen = {};
      for (const o of orders) {
        const id = String(o.order_id ?? o.id ?? "");
        const code = o.sms_code ?? null;
        if (id && code) {
          seen[id] = code;
        }
      }
      this._setSeenCodes(seen);
    },
  },
  methods: {
    _getSeenCodes() {
      return this.db.get("seenCodes") ?? {};
    },
    _setSeenCodes(seenCodes) {
      this.db.set("seenCodes", seenCodes);
    },
    generateMeta(order) {
      const orderId = String(order.order_id ?? order.id ?? "");
      const code = order.sms_code ?? "";
      // Hash to a 64-char SHA256 hex digest so we always stay within
      // Pipedream's 64-char dedupe id limit, regardless of orderId/code length.
      const id = createHash("sha256")
        .update(`${orderId}:${code}`)
        .digest("hex");
      const ts = order.received_at
        ? Date.parse(order.received_at)
        : Date.now();
      return {
        id,
        // Avoid leaking the phone number or the OTP in the emitted event
        // summary — the full payload is still available on the event itself.
        summary: `New SMS received for order ${orderId}`,
        ts,
      };
    },
  },
  async run() {
    const orders = await this.virtualsms.listOrders();
    if (!orders?.length) {
      return;
    }

    const seen = this._getSeenCodes();
    const updated = {
      ...seen,
    };

    for (const order of orders) {
      const id = String(order.order_id ?? order.id ?? "");
      const code = order.sms_code ?? null;
      if (!id || !code) {
        continue;
      }
      if (seen[id] === code) {
        continue;
      }
      const meta = this.generateMeta(order);
      this.$emit(order, meta);
      updated[id] = code;
    }

    this._setSeenCodes(updated);
  },
};
