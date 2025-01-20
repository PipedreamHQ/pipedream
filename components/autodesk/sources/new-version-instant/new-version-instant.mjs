import autodesk from "../../autodesk.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "autodesk-new-version-instant",
  name: "New File Version Created",
  description: "Emit new event when a new version of a file is created in Autodesk. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    autodesk: {
      type: "app",
      app: "autodesk",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    projectId: {
      propDefinition: [
        autodesk,
        "projectId",
      ],
      optional: true,
    },
    fileId: {
      propDefinition: [
        autodesk,
        "fileId",
      ],
      optional: true,
    },
  },
  methods: {
    async _createWebhook() {
      const eventType = "file_version_created";
      const targetUrl = this.http.endpoint;
      const {
        projectId, fileId,
      } = this;

      const webhookOpts = {
        eventType,
        targetUrl,
        projectId: projectId || undefined,
        fileId: fileId || undefined,
      };

      const response = await this.autodesk.createWebhook(webhookOpts);
      return response.id;
    },
    async _deleteWebhook(webhookId) {
      await this.autodesk.deleteWebhook({
        webhookId,
      });
    },
    async _fetchHistoricalEvents() {
      const {
        projectId, fileId,
      } = this;
      let versions = [];

      if (fileId) {
        const fileVersions = await this.autodesk._makeRequest({
          method: "GET",
          path: `/data/v1/files/${fileId}/versions`,
        });
        versions = fileVersions.slice(-50);
      } else if (projectId) {
        const files = await this.autodesk.listFiles({
          projectId,
        });
        for (const file of files) {
          const fileVersions = await this.autodesk._makeRequest({
            method: "GET",
            path: `/data/v1/files/${file.id}/versions`,
          });
          versions = versions.concat(fileVersions.slice(-50));
        }
        versions = versions.slice(-50);
      }

      for (const version of versions) {
        this.$emit(version, {
          id: version.id,
          summary: `New version created for file ${version.fileName}`,
          ts: Date.parse(version.createdAt) || Date.now(),
        });
      }
    },
  },
  hooks: {
    async activate() {
      const webhookId = await this._createWebhook();
      await this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this._deleteWebhook(webhookId);
        await this.db.delete("webhookId");
      }
    },
    async deploy() {
      await this._fetchHistoricalEvents();
    },
  },
  async run(event) {
    const secret = this.autodesk.$auth.secret;
    const signature = event.headers["X-Signature"];
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(event.body)
      .digest("hex");
    if (computedSignature !== signature) {
      await this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    const versionData = JSON.parse(event.body);
    this.$emit(versionData, {
      id: versionData.id || versionData.ts,
      summary: `New version created for file ${versionData.fileName || "unknown"}`,
      ts: Date.parse(versionData.timestamp) || Date.now(),
    });
  },
};
