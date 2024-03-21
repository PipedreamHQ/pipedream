import { axios } from "@pipedream/platform";
import betterStack from "../../better_stack.app.mjs";
import crypto from "crypto";

export default {
  key: "better_stack-new-updated-incident-instant",
  name: "New or Updated Incident (Instant)",
  description: "Emit new event every time an incident is either created or updated.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    betterStack,
    incidentId: {
      propDefinition: [
        betterStack,
        "incidentId",
      ],
    },
    incidentStatus: {
      propDefinition: [
        betterStack,
        "incidentStatus",
      ],
    },
    timeOfIncident: {
      propDefinition: [
        betterStack,
        "timeOfIncident",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    generateMeta(data) {
      return {
        id: data.incidentId,
        summary: `Incident ${data.incidentId}: ${data.incidentStatus}`,
        ts: data.timeOfIncident
          ? Date.parse(data.timeOfIncident)
          : Date.now(),
      };
    },
  },
  hooks: {
    async deploy() {
      // Historical data fetching is not applicable for instant triggers
    },
    async activate() {
      const webhookUrl = this.http.endpoint;
      const webhookId = await this.betterStack.createWebhook({
        webhookUrl,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.betterStack.deleteWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (!body.incidentId) {
      this.http.respond({
        status: 400,
        body: "Bad Request: incidentId is required",
      });
      return;
    }

    // Assuming the signature header and secret token are present for validation
    const signature = headers["x-betterstack-signature"];
    const secret = this.betterStack.$auth.team_token;
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized: Signature mismatch",
      });
      return;
    }

    this.$emit(body, this.generateMeta(body));

    this.http.respond({
      status: 200,
      body: {
        message: "Success",
      },
    });
  },
};
