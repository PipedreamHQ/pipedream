import freshdesk from "../../freshdesk.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";

export default {
  props: {
    freshdesk,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  methods: {
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const data = [];
    let lastDateChecked = this.freshdesk.getLastDateChecked(this.db);
    if (!lastDateChecked) {
      lastDateChecked = new Date().toISOString();
      this.freshdesk.setLastDateChecked(this.db, lastDateChecked);
    }
    let maxTs = lastDateChecked;

    const resourceFn = this.getResourceFn();
    const tsField = this.getTsField();

    const formattedDate = lastDateChecked.substr(
      0,
      (lastDateChecked + "T").indexOf("T"),
    );
    const results = await resourceFn({
      query: `"${tsField}:>'${formattedDate}'"`,
      page: 1,
    });
    for await (const result of results) {
      data.push(result);
    }

    data &&
      data.reverse().forEach((item) => {
        if (moment(item[tsField]).isAfter(lastDateChecked)) {
          if (moment(item[tsField]).isAfter(maxTs)) {
            maxTs = item[tsField];
          }
          this.$emit(item, this.generateMeta(item));
        }
      });

    this.freshdesk.setLastDateChecked(this.db, maxTs);
  },
};
