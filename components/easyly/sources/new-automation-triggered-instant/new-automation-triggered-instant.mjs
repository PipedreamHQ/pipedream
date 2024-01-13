import easyly from "../../easyly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "easyly-new-automation-triggered-instant",
  name: "New Automation Triggered (Instant)",
  description: "Emit new event when an automation with the action 'zapier' is triggered in network leads. [See the documentation](https://api.easyly.com/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    easyly,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    automationName: {
      propDefinition: [
        easyly,
        "automationName",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetching historical events is not applicable for instant triggers
    },
    async activate() {
      // Webhook subscription creation is not required for instant triggers
    },
    async deactivate() {
      // Webhook subscription deletion is not required for instant triggers
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Verify the signature of the incoming webhook
    const expectedSignature = headers["X-Easyly-Signature"];
    const actualSignature = this.easyly.generateSignature(event.body); // Placeholder for signature generation method

    if (expectedSignature !== actualSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized - Invalid Signature",
      });
      return;
    }

    // Check if the automation action is 'zapier'
    if (body.automation_action === "zapier" && body.automation_name === this.automationName) {
      this.$emit(body, {
        id: body.id || `${Date.now()}`, // Fallback to current timestamp if ID is not present
        summary: `New Zapier automation triggered: ${body.automation_name}`,
        ts: Date.parse(body.created_at) || Date.now(), // Fallback to current timestamp if 'created_at' is not provided
      });
    } else {
      this.http.respond({
        status: 200,
        body: "Received a non-zapier automation event or automation name does not match",
      });
    }
  },
};
