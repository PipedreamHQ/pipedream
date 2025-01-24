import charthop from "../../charthop.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "charthop-new-org-change-instant",
  name: "New Organizational Structure Change (Instant)",
  description: "Emit new events when there are changes to the organizational structure, such as team reassignments or role updates. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    charthop: {
      type: "app",
      app: "charthop",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    orgStructureTeamFilter: {
      propDefinition: [
        "charthop",
        "orgStructureTeamFilter",
      ],
      optional: true,
    },
    orgStructureDivisionFilter: {
      propDefinition: [
        "charthop",
        "orgStructureDivisionFilter",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const params = {};
      if (this.orgStructureTeamFilter) params.team = this.orgStructureTeamFilter;
      if (this.orgStructureDivisionFilter) params.division = this.orgStructureDivisionFilter;
      const recentEvents = await this.charthop.emitOrgStructureChangedEvent({
        data: params,
        paginate: true,
        max: 50,
      });
      const events = recentEvents.events || [];
      for (const event of events.slice(-50)) {
        this.$emit(event, {
          id: event.id || event.ts.toString(),
          summary: `Organizational structure change in ${event.team || "unknown team"}`,
          ts: event.ts
            ? Date.parse(event.ts)
            : Date.now(),
        });
      }
    },
    async activate() {
      const webhookUrl = this.http.endpoint;
      const webhookResponse = await this.charthop.createWebhook({
        event: "org_structure_changed",
        url: webhookUrl,
        team: this.orgStructureTeamFilter,
        division: this.orgStructureDivisionFilter,
      });
      await this.db.set("webhookId", webhookResponse.id);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.charthop.deleteWebhook(webhookId);
        await this.db.delete("webhookId");
      }
    },
  },
  async run(event) {
    const secret = this.charthop.$auth.webhook_secret;
    const signature = event.headers["x-charthop-signature"];
    const rawBody = await this.http.rawBody;

    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("base64");

    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const eventData = event.body;
    const id = eventData.id || eventData.ts.toString();
    const summary = `Organizational structure change: ${eventData.description || "No description"}`;
    const ts = eventData.ts
      ? Date.parse(eventData.ts)
      : Date.now();
    this.$emit(eventData, {
      id,
      summary,
      ts,
    });
  },
};
