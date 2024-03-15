import updown_io from "../../updown_io.app.mjs";

export default {
  type: "source",
  key: "updown_io-ssl-expiration-instant",
  name: "SSL Expiration Instant",
  description: "Emits an event when an SSL certificate expiration is detected",
  version: "0.0.{{ts}}",
  dedupe: "unique",
  props: {
    updown_io,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      const sslExpirations = await this.updown_io.checkSslExpiration();
      sslExpirations.forEach((expiration) => {
        this.$emit(expiration, {
          id: expiration.check.token,
          summary: expiration.description,
          ts: Date.parse(expiration.time),
        });
      });
    },
  },
  async run() {
    const sslExpirations = await this.updown_io.checkSslExpiration();
    sslExpirations.forEach((expiration) => {
      this.$emit(expiration, {
        id: expiration.check.token,
        summary: expiration.description,
        ts: Date.parse(expiration.time),
      });
    });
  },
};
