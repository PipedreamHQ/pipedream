import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import teamioo from "../../teamioo.app.mjs";

export default {
  props: {
    teamioo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    groupId: {
      propDefinition: [
        teamioo,
        "groupId",
      ],
      optional: true,
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
      const response = this.teamioo.paginate({
        fn: this.getFunc(),
        params: {
          groupId: this.groupId
            ? this.groupId
            : "any",
        },
        lastDate,
      });

      let responseArray = [];

      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(Date.parse(responseArray[0].addedDate || responseArray[0].createdDate));
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item._id,
          summary: this.getSummary(item),
          ts: Date.parse(item.addedDate || item.createdDate),
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
};
