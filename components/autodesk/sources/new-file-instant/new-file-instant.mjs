import autodesk from "../../autodesk.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "autodesk-new-file-instant",
  name: "New File Uploaded",
  description: "Emit a new event when a file is uploaded to a specified project or folder in Autodesk. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    autodesk: {
      type: "app",
      app: "autodesk",
    },
    projectId: {
      propDefinition: [
        autodesk,
        "projectId",
      ],
    },
    folderId: {
      propDefinition: [
        autodesk,
        "folderId",
      ],
      optional: true,
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    webhookSecret: {
      type: "string",
      label: "Webhook Secret",
      description: "Secret used to validate incoming webhook signatures",
    },
  },
  hooks: {
    async deploy() {
      const params = {
        projectId: this.projectId,
      };
      if (this.folderId) {
        params.folderId = this.folderId;
      }
      const files = await this.autodesk.paginate(this.autodesk.listFiles, params);
      const recentFiles = files.slice(-50).reverse();
      for (const file of recentFiles) {
        this.$emit(file, {
          id: file.id || file.fileId || `${file.created_at}_${file.id}`,
          summary: `New file uploaded: ${file.name}`,
          ts: file.created_at
            ? Date.parse(file.created_at)
            : Date.now(),
        });
      }
    },
    async activate() {
      const targetUrl = this.http.endpoint;
      const eventType = "file.uploaded";
      const webhook = await this.autodesk.createWebhook({
        eventType,
        targetUrl,
        projectId: this.projectId,
        folderId: this.folderId,
      });
      await this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.autodesk.deleteWebhook({
          webhookId,
        });
        await this.db.delete("webhookId");
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-autodesk-signature"] || event.headers["X-Autodesk-Signature"];
    const computedSignature = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(event.rawBody)
      .digest("base64");
    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const file = event.body;
    this.$emit(file, {
      id: file.id || file.fileId || `${file.created_at}_${file.id}`,
      summary: `New file uploaded: ${file.name}`,
      ts: file.created_at
        ? Date.parse(file.created_at)
        : Date.now(),
    });
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
