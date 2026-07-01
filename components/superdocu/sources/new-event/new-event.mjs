import crypto from "crypto";
import app from "../../superdocu.app.mjs";

export default {
  type: "source",
  key: "superdocu-new-event",
  name: "New Event",
  description: "Emit new events from Superdocu. You can configure your webhook [here](https://www.superdocu.com/en/c/settings/api)",
  version: "0.0.2",
  props: {
    app,
    secret: {
      type: "string",
      label: "Secret",
      description: "The secret used to sign the webhook. [Click here](https://developers.superdocu.com/webhooks) for more information.",
    },
    http: "$.interface.http",
  },
  methods: {
    _checkSignature(timestamp, signature) {
      const plain = `${this.secret}${timestamp}`;
      const shasum = crypto.createHash("sha256").update(plain);
      const signatureComputed = shasum.digest("base64");
      if (signature !== signatureComputed) {
        throw new Error("Invalid signature. Event aborted.");
      }
    },
    _checkReplayAttack(t) {
      const fiveMinutes = 5 * 60 * 1000;
      const tolerance = fiveMinutes;
      const timestampMilliseconds = Number(t) * 1000;

      if (timestampMilliseconds < Date.now() - tolerance) {
        throw new Error("Invalid Timestamp Signature. The signature's timestamp is outside of the tolerance zone. Event aborted");
      }
    },
    _emit(event) {
      this.$emit(event, {
        id: `${event.object_id}${event.event}`,
        summary: `${event.event} - ${event.object_id}`,
        ts: event.fired_at,
      });
    },
  },
  async run(event) {
    this._checkSignature(event.headers["x-hub-timestamp"], event.headers["x-hub-signature"]);
    this._checkReplayAttack(event.headers["x-hub-timestamp"]);
    this._emit(event.body);
  },
};
