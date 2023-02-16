import googleClassroom from "../../google_classroom.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    googleClassroom,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    courseStates: {
      propDefinition: [
        googleClassroom,
        "courseStates",
      ],
    },
    course: {
      propDefinition: [
        googleClassroom,
        "course",
        (c) => ({
          courseStates: c.courseStates,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      const results = await this.getHistoricalEvents({
        pageSize: 25,
      });
      let maxUpdatedTime = 0;
      for (const item of results.reverse()) {
        if (this.isRelevant(item)) {
          this.emitEvent(item);
        }

        const updated = Date.parse(item.updateTime);
        if (updated > maxUpdatedTime) {
          maxUpdatedTime = updated;
        }
      }
      this._setAfter(maxUpdatedTime);
    },
  },
  methods: {
    _getAfter() {
      return this.db.get("after");
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
    isAfter(compareDate, after) {
      return !after || Date.parse(compareDate) > after;
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    async paginate(resourceFn, params, type, after = null) {
      const results = [];
      let done = false;
      do {
        const response = await resourceFn(params);
        params.pageToken = response.nextPageToken;

        if (response[type]) {
          for (const item of response[type]) {
            results.push(item);
            if (Date.parse(item.updateTime) <= after) {
              done = true;
              break;
            }
          }
        }
      } while (params.pageToken && !done);
      return results;
    },
    getHistoricalEvents() {
      throw new Error("getHistoricalEvents is not implemented");
    },
    getParams() {
      throw new Error("getParams is not implemented");
    },
    getResults() {
      throw new Error("getResults is not implemented");
    },
    isRelevant() {
      throw new Error("isRelevant is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const after = this._getAfter();

    const results = await this.getResults(after);

    let maxUpdateTime = after;
    for (const item of results) {
      if (this.isRelevant(item, after)) {
        this.emitEvent(item);
      }
      if (item.updateTime > maxUpdateTime) {
        maxUpdateTime = item.updateTime;
      }
    }

    this._setAfter(maxUpdateTime);
  },
};
