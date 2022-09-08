import crypto from "crypto";
import app from "../../eversign.app.mjs";
import options from "../../options.mjs";

export default {
  key: "eversign-new-event",
  type: "source",
  name: "New Event",
  description: "Emit new event when a new event occurs in EverSign",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    apiKey: {
      type: "string",
      label: "API Key",
      description: "The API key for your account. You can find it in your developer settings.",
    },
    events: {
      type: "string[]",
      label: "Events",
      description: "The events you want to watch for",
      options: options.WEBHOOK_EVENTS,
    },
  },
  methods: {
    _getMeta({
      event_hash,
      event_type,
      event_time,
    }) {
      return {
        id: event_hash,
        summary: `${event_type} - ${event_hash}`,
        ts: event_time,
      };
    },
    _checkHmac(eventType, eventTime, receivedHash) {
      console.log("Checking HMAC...");

      if (!eventType || !eventTime || !receivedHash) {
        throw new Error("Missing required parameters");
      }

      const data = eventTime + eventType;
      const expectedSignature = crypto.createHmac("sha256", this.apiKey)
        .update(data, "utf8")
        .digest("hex");

      if (receivedHash !== expectedSignature) {
        throw new Error("Invalid HMAC Signature, connection aborted.");
      }

      console.log("HMAC check passed");
    },
  },
  async run(req) {
    console.log("Event received");
    if (!req.body) {
      throw new Error("Missing body");
    }

    if (this.events.indexOf(req.body.event_type) === -1) {
      console.log("Event not in list of watched events, skipping");
      return;
    }

    this._checkHmac(
      req.body.event_type,
      req.body.event_time,
      req.body.event_hash,
    );
    this.$emit(req.body, this._getMeta(req.body));
    this.http.respond({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
