import { axios } from "@pipedream/platform";
import agentset from "../../agentset.app.mjs";

export default {
  key: "agentset-new-ingest-job",
  name: "New Ingest Job Created",
  description: "Emit new event when a new ingest job is created. [See the documentation](https://docs.agentset.ai/api-reference/endpoint/ingest-jobs/list)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    agentset,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60,
      },
    },
    namespaceId: {
      propDefinition: [
        agentset,
        "namespaceId",
      ],
    },
  },
  methods: {
    _getLastIngestJobId() {
      return this.db.get("lastIngestJobId");
    },
    _setLastIngestJobId(lastIngestJobId) {
      this.db.set("lastIngestJobId", lastIngestJobId);
    },
    async listIngestJobs(namespaceId, params = {}) {
      return this.agentset.listIngestJobs(namespaceId, {
        params,
      });
    },
  },
  hooks: {
    async deploy() {
      await this.processIngestJobs();
    },
  },
  async run() {
    await this.processIngestJobs();
  },
  async processIngestJobs() {
    const namespaceId = this.namespaceId;
    const lastIngestJobId = this._getLastIngestJobId();

    const ingestJobs = await this.listIngestJobs(namespaceId);

    for (const job of ingestJobs.reverse()) {
      if (job.id === lastIngestJobId) break;

      this.$emit(job, {
        id: job.id,
        summary: `New Ingest Job: ${job.payload.type}`,
        ts: Date.parse(job.createdAt),
      });
    }

    if (ingestJobs[0]) {
      this._setLastIngestJobId(ingestJobs[0].id);
    }
  },
};
