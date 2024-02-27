import fluxguard from "../../fluxguard.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fluxguard-new-change-detected-instant",
  name: "New Change Detected Instant",
  description: "Emit new event when a change is detected to a web page. [See the documentation](https://docs.fluxguard.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    fluxguard: {
      type: "app",
      app: "fluxguard",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    projectId: {
      propDefinition: [
        fluxguard,
        "projectId",
      ],
    },
    checkId: {
      propDefinition: [
        fluxguard,
        "checkId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      const changes = await this.fluxguard.paginate(this.fluxguard.detectChanges, {
        projectId: this.projectId,
        checkId: this.checkId,
      });
      const eventsToEmit = changes.slice(-50).reverse();
      for (const change of eventsToEmit) {
        this.$emit(change, {
          id: change.id,
          summary: "New change detected",
          ts: Date.parse(change.created_at),
        });
      }
    },
    async activate() {
      const { id } = await this.fluxguard.detectChanges({
        projectId: this.projectId,
        checkId: this.checkId,
      });
      this.db.set("webhookId", id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.fluxguard.deleteWebhook({
          projectId: this.projectId,
          checkId: this.checkId,
          webhookId,
        });
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    const signature = headers["x-fluxguard-signature"];
    if (!signature) {
      this.http.respond({
        status: 401,
        body: "Missing signature",
      });
      return;
    }

    const computedSignature = this.fluxguard.computeSignature(body);
    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Invalid signature",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "Success",
    });

    this.$emit(body, {
      id: body.id,
      summary: "New change detected",
      ts: body.timestamp
        ? parseInt(body.timestamp)
        : new Date().getTime(),
    });
  },
};
