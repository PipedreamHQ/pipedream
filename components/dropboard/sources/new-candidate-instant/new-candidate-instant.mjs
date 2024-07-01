import { axios } from "@pipedream/platform";
import dropboard from "../../dropboard.app.mjs";

export default {
  key: "dropboard-new-candidate-instant",
  name: "New Candidate Profile Created",
  description: "Emit new event when a candidate profile is created. [See the documentation](https://dropboard.readme.io/reference/webhooks-candidates)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dropboard,
    db: "$.service.db",
    jobId: {
      propDefinition: [
        dropboard,
        "jobId",
      ],
      optional: true,
    },
    clientId: {
      propDefinition: [
        dropboard,
        "clientId",
      ],
      optional: true,
    },
    hiringManagerEmail: {
      propDefinition: [
        dropboard,
        "hiringManagerEmail",
      ],
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL to receive Dropboard data",
      required: true,
    },
  },
  hooks: {
    async deploy() {
      const response = await this.dropboard.createCandidateWebhook({
        data: {
          url: this.webhookUrl,
          jobId: this.jobId,
          clientId: this.clientId,
          hiringManagerEmail: this.hiringManagerEmail,
        },
      });

      this.db.set("webhookId", response.id);

      // Fetch and emit historical data
      const candidates = await this.dropboard._makeRequest({
        method: "GET",
        path: "/candidates",
      });
      candidates.slice(0, 50).forEach((candidate) => {
        this.$emit(candidate, {
          id: candidate.id,
          summary: `New Candidate: ${candidate.name}`,
          ts: Date.parse(candidate.created_at),
        });
      });
    },
    async activate() {
      const response = await this.dropboard.createCandidateWebhook({
        data: {
          url: this.webhookUrl,
          jobId: this.jobId,
          clientId: this.clientId,
          hiringManagerEmail: this.hiringManagerEmail,
        },
      });

      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.dropboard._baseUrl()}/candidates/webhooks`,
          headers: {
            Authorization: `Bearer ${this.dropboard.$auth.oauth_access_token}`,
          },
          data: {
            id: webhookId,
          },
        });
      }
    },
  },
  async run() {
    const event = this.http.body;
    this.$emit(event, {
      id: event.id,
      summary: `New Candidate: ${event.name}`,
      ts: Date.parse(event.created_at),
    });
  },
};
