import autodesk from "../../autodesk.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "autodesk-new-project-instant",
  name: "New Project Created",
  description: "Emit new event when a new project is created in Autodesk. [See the documentation](https://aps.autodesk.com/developer/documentation)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    autodesk: {
      type: "app",
      app: "autodesk",
    },
    workspaceId: {
      propDefinition: [
        autodesk,
        "workspaceId",
      ],
    },
    accountId: {
      propDefinition: [
        autodesk,
        "accountId",
      ],
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      if (!this.workspaceId && !this.accountId) {
        throw new Error("You must provide either a workspace or account to monitor.");
      }
      const webhook = await this.autodesk.createWebhook({
        eventType: "project.created",
        targetUrl: this.http.endpoint,
        workspaceId: this.workspaceId,
        accountId: this.accountId,
      });
      await this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.autodesk.deleteWebhook({
          webhookId,
        });
        await this.db.set("webhookId", null);
      }
    },
    async deploy() {
      const projects = await this.autodesk.paginate(this.autodesk.listProjects, {
        workspaceId: this.workspaceId,
        accountId: this.accountId,
      });
      const last50Projects = projects.slice(-50);

      // Emit from oldest to newest
      for (const project of last50Projects) {
        const id = project.id || project.ts;
        const summary = `New project created: ${project.name}`;
        const ts = project.createdAt
          ? Date.parse(project.createdAt)
          : Date.now();

        this.$emit(project, {
          id,
          summary,
          ts,
        });
      }
    },
  },
  async run(event) {
    const signature = event.headers["X-Signature"];
    const rawBody = event.body;
    const secret = this.autodesk.$auth.webhookSecret;

    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const project = event.body;

    const id = project.id || Date.now();
    const summary = `New project created: ${project.name}`;
    const ts = project.createdAt
      ? Date.parse(project.createdAt)
      : Date.now();

    this.$emit(project, {
      id,
      summary,
      ts,
    });
  },
};
