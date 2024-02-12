import { axios } from "@pipedream/platform";
import linearb from "../../linearb.app.mjs";

export default {
  key: "linearb-new-merge-created",
  name: "New Merge Created",
  description: "Emits a new event when a merge is created. [See the documentation](https://linearb.helpdocs.io/article/vnw2fw6226-set-up-release-detection-method)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    linearb,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    repoUrl: {
      propDefinition: [
        linearb,
        "repoUrl",
      ],
    },
    refName: {
      propDefinition: [
        linearb,
        "refName",
      ],
    },
  },
  methods: {
    _getLastRun() {
      return this.db.get("lastRun") || null;
    },
    _setLastRun(lastRun) {
      this.db.set("lastRun", lastRun);
    },
  },
  hooks: {
    async deploy() {
      // Fetch historical data and emit up to 50 events
      const lastRun = new Date().toISOString();
      const merges = await this.linearb.getMergeEvents({
        lastRun,
      });
      merges.slice(0, 50).forEach((merge) => {
        this.$emit(merge, {
          id: merge.id,
          summary: `New Merge: ${merge.title}`,
          ts: Date.parse(merge.created_at),
        });
      });
      this._setLastRun(lastRun);
    },
  },
  async run() {
    const lastRun = this._getLastRun();
    const currentRun = new Date().toISOString();

    // Fetch new merges since the last run
    const merges = await this.linearb.getMergeEvents({
      lastRun,
    });
    merges.forEach((merge) => {
      this.$emit(merge, {
        id: merge.id,
        summary: `New Merge: ${merge.title}`,
        ts: Date.parse(merge.created_at),
      });
    });

    this._setLastRun(currentRun);
  },
};
