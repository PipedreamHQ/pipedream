import whatsapp from "../../whatsapp_business.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "whatsapp_business-new-message-sent",
  name: "New Message Sent",
  description: "Emit new event when a new message is sent or received. A Webhook subscribed to field \"messages\" must be set up from the App Dashboard of your [Facebook Developer Account](https://developers.facebook.com/). See [documentation](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#configure-webhooks-product) for more information about Webhook setup.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    whatsapp,
    db: "$.service.db",
    httpInterface: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    _getChallengeToken() {
      return this.db.get("challengeToken");
    },
    _setChallengeToken(challengeToken) {
      this.db.set("challengeToken", challengeToken);
    },
  },
  async run(event) {
    const {
      body, query,
    } = event;
    if (query["hub.challenge"]) {
      this._setChallengeToken(query["hub.challenge"]);
    }
    const challengeToken = this._getChallengeToken();

    this.httpInterface.respond({
      status: "200",
      body: challengeToken,
      headers: {
        "content-type": "application/json",
      },
    });

    if (!body) {
      return;
    }

    const entries = body?.entry || [];
    for (const entry of entries) {
      if (entry.changes && entry.changes?.length > 0) {
        const status = entry?.changes[0]?.value?.statuses
          ? entry?.changes[0]?.value?.statuses[0]?.status
          : null;
        if (status && status !== "sent") {
          continue;
        }
      }
      this.$emit(entry, {
        id: Date.now(),
        summary: "New Message Sent",
        ts: Date.now(),
      });
    }
  },
  sampleEmit,
};
