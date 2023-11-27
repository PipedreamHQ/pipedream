import app from "../../recruitee.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "recruitee-new-candidate",
  name: "New Candidate Created",
  description: "Emit new event when a new candidate is created. [See the Documentation](https://api.recruitee.com/docs/index.html#candidate.web.candidate-candidate.web.candidate-get)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New candidate: "${data.name}"`,
        ts: Date.parse(data.created_at),
      });
    },
    _setLastCreatedAfter(timestamp) {
      this.db.set("lastCreatedAfter", timestamp);
    },
    _getLastCreatedAfter() {
      return this.db.get("lastCreatedAfter");
    },
  },
  async run() {
    const lastCreatedAfter = this._getLastCreatedAfter();
    const {
      candidates,
      generated_at: generatedAt,
    } = await this.app.listCandidates({
      params: {
        created_after: lastCreatedAfter,
      },
    });
    this._setLastCreatedAfter(generatedAt);
    for (const candidate of candidates) {
      this.emitEvent(candidate);
    }
  },
};
