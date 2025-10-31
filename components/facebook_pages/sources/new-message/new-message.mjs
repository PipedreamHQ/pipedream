import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "facebook_pages-new-message",
  name: "New Message Received",
  description: "Emit new event when your Facebook Page receives a new message via Messenger.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFields() {
      return [
        "messages",
      ];
    },
    generateMeta(data) {
      const {
        sender, timestamp, message,
      } = data;
      const ts = timestamp || Date.now();
      const id = message?.mid || `message-${sender?.id}-${ts}`;

      let summary = "New message received";
      if (message?.text) {
        summary = `New message: ${message.text.substring(0, 50)}...`;
      } else if (message?.attachments?.length > 0) {
        summary = `New message with ${message.attachments.length} attachment(s)`;
      }

      return {
        id,
        summary,
        ts,
      };
    },
    processEvent(change) {
      if (change.field === "messages" && change.value?.messaging) {
        // Facebook sends messages in a messaging array
        for (const messagingEvent of change.value.messaging) {
          if (messagingEvent.message) {
            return messagingEvent;
          }
        }
      }
      return null;
    },
  },
  async run(event) {
    const {
      query, body, method,
    } = event;

    // Handle webhook verification from Facebook
    if (method === "GET") {
      const mode = query["hub.mode"];
      const token = query["hub.verify_token"];
      const challenge = query["hub.challenge"];

      if (mode === "subscribe" && token === this._getVerifyToken()) {
        console.log("Webhook verified");
        this.http.respond({
          status: 200,
          body: challenge,
        });
        return;
      } else {
        console.log("Webhook verification failed");
        this.http.respond({
          status: 403,
        });
        return;
      }
    }

    // Handle webhook events
    this.http.respond({
      status: 200,
    });

    if (body?.object === "page" && body?.entry) {
      for (const entry of body.entry) {
        // Messages come in a different format than regular feed changes
        if (entry.messaging) {
          for (const messagingEvent of entry.messaging) {
            if (messagingEvent.message) {
              const meta = this.generateMeta(messagingEvent);
              this.$emit(messagingEvent, meta);
            }
          }
        } else if (entry.changes) {
          // Fallback to the common handler for other message-related changes
          for (const change of entry.changes) {
            const eventData = this.processEvent(change);
            if (eventData) {
              const meta = this.generateMeta(eventData);
              this.$emit(eventData, meta);
            }
          }
        }
      }
    }
  },
};
