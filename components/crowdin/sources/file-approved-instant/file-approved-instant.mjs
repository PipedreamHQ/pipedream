import crowdin from "../../crowdin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crowdin-file-approved-instant",
  name: "File Approved Instant",
  description: "Emit new event when a file is fully translated and approved. [See the documentation](https://support.crowdin.com/developer/api/v2/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    crowdin,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    projectId: {
      propDefinition: [
        crowdin,
        "projectId",
      ],
    },
    name: {
      propDefinition: [
        crowdin,
        "name",
      ],
    },
  },
  methods: {
    async _createWebhook() {
      const response = await axios(this, {
        url: `${this.crowdin._baseUrl()}/projects/${this.projectId}/webhooks`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.crowdin.$auth.access_token}`,
        },
        data: {
          name: this.name,
          events: [
            "project.approved",
          ],
          url: this.http.endpoint,
        },
      });
      this.db.set("webhookId", response.id);
    },
    async _deleteWebhook() {
      const webhookId = this.db.get("webhookId");
      if (!webhookId) {
        console.log("No webhook ID found, skipping deletion.");
        return;
      }
      await axios(this, {
        url: `${this.crowdin._baseUrl()}/projects/${this.projectId}/webhooks/${webhookId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.crowdin.$auth.access_token}`,
        },
      });
    },
    async emitFileApprovedEvents(events) {
      for (const event of events) {
        this.$emit(event, {
          id: event.data.id,
          summary: `File approved for project ID: ${event.data.project_id}`,
          ts: Date.parse(event.data.updatedAt) || Date.now(),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      const events = await this.crowdin.emitFileApprovedEvent({
        projectId: this.projectId,
        name: this.name,
      });
      this.methods.emitFileApprovedEvents(events.slice(0, 50).reverse());
    },
    async activate() {
      await this.methods._createWebhook();
    },
    async deactivate() {
      await this.methods._deleteWebhook();
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Here you would typically validate the signature with headers and rawBody
    const isValid = true; // This should be replaced by actual signature validation logic
    if (!isValid) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    if (body.event === "project.approved") {
      this.$emit(body, {
        id: body.data.id,
        summary: `File approved for project ID: ${body.data.project_id}`,
        ts: Date.parse(body.data.updatedAt) || Date.now(),
      });
    }
  },
};
