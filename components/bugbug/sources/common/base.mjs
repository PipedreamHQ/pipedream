import bugbug from "../../bugbug.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  props: {
    bugbug,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastStartedTime() {
      return this.db.get("lastStartedTime");
    },
    _setLastStartedTime(lastStartedTime) {
      this.db.set("lastStartedTime", lastStartedTime);
    },
    getParams() {
      return {};
    },
    getRelevantRuns(runs) {
      return runs;
    },
    emitEvent(run) {
      const meta = this.generateMeta(run);
      this.$emit(run, meta);
    },
    generateMeta(run) {
      return {
        id: run.id,
        summary: `New Failed Run ${run.id}`,
        ts: Date.now(),
      };
    },
    async getPaginatedResults(lastStartedTime, params) {
      const runs = [];
      let done = false;
      do {
        const { results } = await this.bugbug.listTestRuns({
          params,
        });
        for (const result of results) {
          if (result.started
            && lastStartedTime
            && Date.parse(result.started) <= Date.parse(lastStartedTime)
          ) {
            done = true;
            break;
          }
          runs.push(result);
        }
        params.page++;
      } while (!done && runs.length === params.page_size);
      return runs;
    },
    async processEvent(limit) {
      const params = {
        ordering: "-started",
        page_size: constants.DEFAULT_LIMIT,
        page: 1,
        ...this.getParams(),
      };
      const lastStartedTime = this._getLastStartedTime();
      if (lastStartedTime) {
        params.started_after = lastStartedTime;
      }
      const runs = await this.getPaginatedResults(lastStartedTime, params);
      if (!runs.length) {
        return;
      }
      const lastStartedRun = runs.find((run) => run.started);
      if (lastStartedRun) {
        this._setLastStartedTime(lastStartedRun.started);
      }
      let relevantRuns = await this.getRelevantRuns(runs);
      if (limit) {
        relevantRuns = relevantRuns.slice(0, limit);
      }
      relevantRuns.reverse().forEach((run) => this.emitEvent(run));
    },
  },
  async run() {
    await this.processEvent();
  },
};
