import dailybot from "../../dailybot.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dailybot-kudos-given-instant",
  name: "Kudos Given Instant",
  description: "Emit new event every time any kudos are given to someone in your DailyBot organization.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dailybot,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    senderId: {
      propDefinition: [
        dailybot,
        "senderId",
      ],
    },
    receiverId: {
      propDefinition: [
        dailybot,
        "receiverId",
      ],
    },
  },
  hooks: {
    async activate() {
      // Activation logic, if necessary, to subscribe to webhook events
    },
    async deactivate() {
      // Deactivation logic, if necessary, to unsubscribe from webhook events
    },
  },
  async run(event) {
    // Assuming the incoming webhook payload has the structure for kudos given event
    const { body } = event;
    if (!body) {
      throw new Error("No body found in the event.");
    }

    // Validate the incoming webhook for security
    // This is a placeholder, replace <YOUR_SECRET> with your actual secret and adjust the validation logic as per your security requirements
    const signature = event.headers["x-dailybot-signature"];
    const expectedSignature = "ExpectedSignatureBasedOnYourSecret"; // Replace with actual logic to compute the expected signature
    if (signature !== expectedSignature) {
      this.http.respond({
        status: 403,
        body: "Forbidden: Incorrect signature",
      });
      console.log("Forbidden: Incorrect signature");
      return;
    }

    const kudosEvent = body;
    // Emitting the whole kudos event. In a real scenario, you might want to pick specific fields to emit.
    this.$emit(kudosEvent, {
      id: kudosEvent.id, // Assuming there's a unique ID for each kudos event
      summary: `Kudos from ${kudosEvent.senderId} to ${kudosEvent.receiverId}`,
      ts: Date.parse(kudosEvent.createdAt), // Assuming there's a timestamp field in the kudos event
    });

    // Respond to the webhook
    this.http.respond({
      status: 200,
      body: "Event processed",
    });
  },
};
