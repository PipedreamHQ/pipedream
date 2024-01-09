import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { DEFAULT_LAST_DATE } from "../../common/constants.mjs";
import gleap from "../../gleap.app.mjs";

export default {
  props: {
    gleap,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        gleap,
        "projectId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || DEFAULT_LAST_DATE;
    },
    _setLastDate(lastDate = null) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();
      const timeField = this.getTimeField();

      const response = this.gleap.paginate({
        fn: this.gleap.listFeedbacks,
        maxResults,
        projectId: this.projectId,
        params: {
          sort: `-${timeField}`,
        },
      });

      let responseArray = [];

      for await (const item of response) {
        if (Date.parse(item[timeField]) <= Date.parse(lastDate)) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0][timeField]);

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
