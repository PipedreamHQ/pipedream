import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import browserstack from "../../browserstack.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "browserstack-new-automate-build",
  name: "New Automate Build",
  description: "Emit new event when a new automate build is created. [See the documentation](https://www.browserstack.com/docs/test-reporting-and-analytics/api/get-build-list)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    browserstack,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        browserstack,
        "projectId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const response = this.browserstack.paginate({
        fn: this.browserstack.listBuilds,
        projectId: this.projectId,
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item.started_at) <= lastDate) break;
        responseArray.push(item);
      }

      responseArray.reverse();

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(Date.parse(responseArray[0].started_at || new Date()));
      }

      for (const item of responseArray.reverse()) {
        const ts = Date.parse(item.started_at || new Date());
        this.$emit(item, {
          id: `${item.build_id}-${ts}`,
          summary: `New automate build created: ${item.build_id}`,
          ts,
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
  sampleEmit,
};
