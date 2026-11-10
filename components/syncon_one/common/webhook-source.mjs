import { createHmac, timingSafeEqual } from "node:crypto";
import syncOne from "../syncon_one.app.mjs";

const TOLERANCE_SECONDS = 300;

/** `t=<unix>,v1=<hex>` over `<t>.<body>`: the same check the webhook docs give receivers. */
export function signatureOk(secret, rawBody, header) {
  if (!secret || !header || typeof rawBody !== "string") return false;
  const parts = {};
  for (const part of String(header).split(",")) {
    const index = part.indexOf("=");
    if (index > 0) parts[part.slice(0, index).trim()] = part.slice(index + 1).trim();
  }
  const at = Number(parts.t);
  if (!Number.isFinite(at) || Math.abs(Date.now() / 1000 - at) > TOLERANCE_SECONDS) return false;
  const expected = createHmac("sha256", secret).update(`${parts.t}.${rawBody}`).digest("hex");
  const given = Buffer.from(parts.v1 ?? "", "utf8");
  const wanted = Buffer.from(expected, "utf8");
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

/**
 * The shared body of every Syncon One source. Turning the source on subscribes its address to
 * Syncon One's webhooks and turning it off removes the subscription. A delivery carries only ids,
 * so a source reads the record with the user's own key: a record that key cannot see produces
 * nothing. A delivery whose signature does not verify is dropped.
 */
export default {
  props: {
    syncOne,
    http: { type: "$.interface.http", customResponse: true },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const created = await this.syncOne.subscribe({
        $: this,
        url: this.http.endpoint,
        events: [this.getEvent()],
      });
      this.db.set("webhookId", created.data.id);
      this.db.set("secret", created.data.secret);
    },
    async deactivate() {
      const id = this.db.get("webhookId");
      if (id) await this.syncOne.unsubscribe({ $: this, id });
      this.db.set("webhookId", null);
      this.db.set("secret", null);
    },
  },
  methods: {
    /** The Syncon One event this source listens to. */
    getEvent() {
      throw new Error("getEvent is not implemented");
    },
    /** Where the thing the event is about is read. */
    getPath() {
      return null;
    },
    /** Under which key of the event's data its public id is. */
    getIdKey() {
      return "conversationId";
    },
    /** Set for record events, whose data names an objectType and a publicId instead. */
    getObjectType() {
      return null;
    },
    /** Many deliveries about one record are many events; set for those. */
    isComposite() {
      return false;
    },
    /** For events whose record cannot be read back (a deletion): built from the event alone. */
    fromEvent() {
      return null;
    },
    getSummary() {
      return this.getEvent();
    },
    generateMeta(record, envelope) {
      return {
        id: this.isComposite() ? `${record.id}-${envelope.id}` : (record.id ?? envelope.id),
        summary: `${this.getSummary()} ${record.record_id ?? record.id ?? ""}`.trim(),
        ts: Date.parse(envelope.createdAt) || Date.now(),
      };
    },
  },
  async run(event) {
    const secret = this.db.get("secret");
    const raw = typeof event.bodyRaw === "string" ? event.bodyRaw : null;
    if (
      secret &&
      raw !== null &&
      !signatureOk(secret, raw, event.headers?.["x-syncon-signature"])
    ) {
      this.http.respond({ status: 400, body: "refused" });
      return;
    }
    this.http.respond({ status: 200, body: "ok" });
    const body = event.body;
    for (const envelope of Array.isArray(body) ? body : [body]) {
      if (!envelope || envelope.type !== this.getEvent()) continue;
      const built = this.fromEvent(envelope);
      if (built) {
        this.$emit(built, this.generateMeta(built, envelope));
        continue;
      }
      const objectType = this.getObjectType();
      const target = objectType ? envelope.data?.publicId : envelope.data?.[this.getIdKey()];
      if (typeof target !== "string" || !target) continue;
      if (objectType && envelope.data?.objectType !== objectType) continue;
      const record = await this.syncOne.getById({ $: this, path: this.getPath(), id: target });
      if (!record) continue;
      const emitted = this.isComposite()
        ? { ...record, record_id: record.id, event_id: envelope.id }
        : { ...record, event_id: envelope.id };
      this.$emit(emitted, this.generateMeta(record, envelope));
    }
  },
};
