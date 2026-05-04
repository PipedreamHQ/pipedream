import { createHash } from "crypto";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import virtualsms from "../../virtualsms.app.mjs";

// Statuses considered terminal — no SMS can arrive after these.
// Anything NOT in this set is treated as still-active and polled.
const TERMINAL_STATUSES = new Set([
  "cancelled",
  "expired",
  "completed",
  "refunded",
  "failed",
]);

// Cap the per-poll fan-out so a user with many active orders does not flood
// the API. Pipedream polls every 60 s by default, so this is per-minute.
const MAX_ACTIVE_ORDERS_PER_POLL = 50;

export default {
  key: "virtualsms-new-sms-received",
  name: "New SMS Received",
  description: "Emit new event for each SMS message received on any of your active rentals. Polls the VirtualSMS API on the configured interval (default 60s) and de-duplicates so each SMS is emitted exactly once. [See the documentation](https://virtualsms.io/docs/api-reference/introduction)",
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
      const active = orders
        .filter((o) => !TERMINAL_STATUSES.has(String(o.status ?? "").toLowerCase()))
        .slice(0, MAX_ACTIVE_ORDERS_PER_POLL);
      const seen = {};
      for (const o of active) {
        const orderId = String(o.id ?? o.order_id ?? "");
        if (!orderId) continue;
        const detail = await this._safeGetOrder(orderId);
        if (!detail || !Array.isArray(detail.messages)) continue;
        for (const msg of detail.messages) {
          const dedupeId = this._dedupeId(orderId, msg);
          if (dedupeId) {
            seen[dedupeId] = true;
          }
        }
      }
      this._setSeenIds(seen);
    },
  },
  methods: {
    _getSeenIds() {
      return this.db.get("seenIds") ?? {};
    },
    _setSeenIds(seenIds) {
      this.db.set("seenIds", seenIds);
    },
    _dedupeId(orderId, msg) {
      const content = String(msg?.content ?? "");
      const receivedAt = String(msg?.received_at ?? "");
      // Use received_at when available (stable identifier) plus content;
      // fall back to content alone if backend omits the timestamp.
      const seed = receivedAt
        ? `${orderId}:${receivedAt}:${content}`
        : `${orderId}:${content}`;
      return createHash("sha256").update(seed)
        .digest("hex");
    },
    async _safeGetOrder(orderId) {
      try {
        return await this.virtualsms.getOrder({
          orderId,
        });
      } catch (err) {
        // 404 / 4xx / 5xx — skip this order this round, do not crash polling.
        const status = err?.response?.status;
        // eslint-disable-next-line no-console
        console.log(`[new-sms-received] getOrder ${orderId} failed (status=${status ?? "?"}); skipping`);
        return null;
      }
    },
    generateMeta(orderId, msg) {
      const id = this._dedupeId(orderId, msg);
      const ts = msg?.received_at
        ? Date.parse(msg.received_at)
        : Date.now();
      return {
        id,
        // Avoid leaking the phone number, sender, or OTP body in the emitted
        // event summary — the full payload is still available on the event.
        summary: `New SMS received for order ${orderId}`,
        ts: Number.isFinite(ts)
          ? ts
          : Date.now(),
      };
    },
  },
  async run() {
    const orders = await this.virtualsms.listOrders();
    if (!orders?.length) {
      return;
    }

    const active = orders
      .filter((o) => !TERMINAL_STATUSES.has(String(o.status ?? "").toLowerCase()))
      .slice(0, MAX_ACTIVE_ORDERS_PER_POLL);
    if (!active.length) {
      return;
    }

    const seen = this._getSeenIds();
    const updated = {
      ...seen,
    };

    for (const order of active) {
      const orderId = String(order.id ?? order.order_id ?? "");
      if (!orderId) continue;

      const detail = await this._safeGetOrder(orderId);
      if (!detail || !Array.isArray(detail.messages) || detail.messages.length === 0) {
        continue;
      }

      for (const msg of detail.messages) {
        const dedupeId = this._dedupeId(orderId, msg);
        if (!dedupeId || seen[dedupeId]) {
          continue;
        }
        const meta = this.generateMeta(orderId, msg);
        // Emit the full order detail (which includes the messages array)
        // plus the single triggering message at top-level for convenience.
        this.$emit({
          ...detail,
          message: msg,
        }, meta);
        updated[dedupeId] = true;
      }
    }

    this._setSeenIds(updated);
  },
};
