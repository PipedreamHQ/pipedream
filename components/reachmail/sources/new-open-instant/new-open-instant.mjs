import reachmail from "../../reachmail.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "reachmail-new-open-instant",
  name: "New Email Open Instant",
  description: "Emit new event when a recipient opens an email. [See the documentation](https://services.reachmail.net/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    reachmail: {
      type: "app",
      app: "reachmail",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Fetch and emit the last 50 open events as historical data
      const opens = await this.reachmail._makeRequest({
        method: "GET",
        path: "/reports/easysmtp/opens",
        params: {
          limit: 50,
        },
      });
      opens.forEach((open) => {
        this.$emit(open, {
          id: open.Id,
          summary: `Email opened by ${open.Recipient}`,
          ts: Date.parse(open.Date),
        });
      });
    },
    async activate() {
      // Placeholder for webhook creation logic
      // Actual implementation would depend on the ReachMail API capabilities
      const webhookId = "placeholder-for-webhook-id"; // This should be replaced with actual webhook creation logic
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      // Placeholder for webhook deletion logic
      // Actual implementation would depend on the ReachMail API capabilities
      const webhookId = this.db.get("webhookId");
      // This should be replaced with actual webhook deletion logic
      console.log(`Placeholder for deleting webhook with ID: ${webhookId}`);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Validate the signature to ensure the event is from ReachMail
    // This is a placeholder, the actual implementation would depend on ReachMail's webhook signature mechanism
    const isValidSignature = true; // Replace this with actual signature validation logic
    if (!isValidSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    // Emit the event
    this.$emit(body, {
      id: body.Id,
      summary: `Email opened by ${body.Recipient}`,
      ts: Date.parse(body.Date),
    });

    // Respond to the HTTP request
    this.http.respond({
      status: 200,
      body: "Event processed",
    });
  },
};
