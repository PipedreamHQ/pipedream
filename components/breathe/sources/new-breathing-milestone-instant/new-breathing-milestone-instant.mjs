import breathe from "../../breathe.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "breathe-new-breathing-milestone-instant",
  name: "New Breathing Milestone Instant",
  description: "Emit new event when a user reaches a breathing milestone, such as completing a streak or total minutes goal. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    breathe: {
      type: "app",
      app: "breathe",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    milestoneType: {
      propDefinition: [
        "breathe",
        "milestoneType",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const params = {
        per_page: 50,
        sort: "desc",
      };
      const milestones = await this.breathe._makeRequest({
        method: "GET",
        path: "/milestones",
        params,
      });
      const last50Milestones = milestones.slice(-50);
      for (const milestone of last50Milestones) {
        this.$emit(milestone, {
          id: milestone.id || `milestone_${milestone.timestamp}`,
          summary: `New milestone reached: ${milestone.name}`,
          ts: Date.parse(milestone.timestamp) || Date.now(),
        });
      }
    },
    async activate() {
      const webhookUrl = this.http.endpoint;
      const data = {
        url: webhookUrl,
        events: [
          "milestone_reached",
        ],
      };
      if (this.milestoneType) {
        data.types = [
          this.milestoneType,
        ];
      }
      const response = await this.breathe._makeRequest({
        method: "POST",
        path: "/webhooks",
        data,
      });
      const webhookId = response.id;
      await this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.breathe._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-breathe-signature"];
    const rawBody = event.bodyRaw;
    const secret = this.breathe.$auth.webhook_secret;
    const computedSignature = crypto.createHmac("sha256", secret).update(rawBody)
      .digest("hex");
    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    const eventData = JSON.parse(rawBody);
    const milestone = eventData.milestone;
    if (this.milestoneType && milestone.type !== this.milestoneType) {
      return;
    }
    this.$emit(milestone, {
      id: milestone.id || `milestone_${milestone.timestamp}`,
      summary: `New milestone reached: ${milestone.name}`,
      ts: milestone.timestamp
        ? Date.parse(milestone.timestamp)
        : Date.now(),
    });
  },
};
