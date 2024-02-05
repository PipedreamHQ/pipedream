import { axios } from "@pipedream/platform";
import seqera from "../../seqera.app.mjs";

export default {
  key: "seqera-new-run-created",
  name: "New Run Created",
  description: "Emits an event when a new run is created in Seqera. [See the documentation](https://docs.seqera.io/platform/23.3.0/api/overview)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    seqera,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    eventId: {
      propDefinition: [
        seqera,
        "eventId",
      ],
    },
  },
  methods: {
    _getLatestRunId() {
      return this.db.get("latestRunId") || null;
    },
    _setLatestRunId(latestRunId) {
      this.db.set("latestRunId", latestRunId);
    },
  },
  hooks: {
    async deploy() {
      const { items: runs } = await this.seqera.listEvents({
        params: {
          page: 0,
        },
      });
      if (runs.length > 0) {
        const latestRun = runs[0];
        this._setLatestRunId(latestRun.id);
        this.$emit(latestRun, {
          id: latestRun.id,
          summary: `New Run: ${latestRun.name}`,
          ts: Date.parse(latestRun.dateCreated),
        });
      }
    },
  },
  async run() {
    const latestRunId = this._getLatestRunId();
    let nextPageToken = null;
    let newRunsEmitted = false;

    do {
      const response = await this.seqera.listEvents({
        params: {
          page: nextPageToken,
        },
      });
      const {
        items: runs, nextPageToken: newNextPageToken,
      } = response;
      nextPageToken = newNextPageToken;

      for (const run of runs) {
        if (run.id === latestRunId) {
          nextPageToken = null;
          break;
        }
        this.$emit(run, {
          id: run.id,
          summary: `New Run: ${run.name}`,
          ts: Date.parse(run.dateCreated),
        });
        newRunsEmitted = true;
      }
    } while (nextPageToken);

    if (newRunsEmitted) {
      this._setLatestRunId(runs[0].id);
    }
  },
};
