import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  props: {
    planviewLeankit,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Monday API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    boardId: {
      propDefinition: [
        planviewLeankit,
        "boardId",
      ],
      withLabel: true,
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async startEvent(maxResults) {
      const lastDate = this._getLastDate();
      const responseArray = [];
      let tempLastDate = lastDate;

      const items = this.planviewLeankit.activityPaginate({
        fn: this.getFunc(),
        boardId: this.boardId.value,
        maxResults,
      });

      for await (const item of items) {
        const newLastDate = item.timestamp;
        if (moment(newLastDate).isAfter(lastDate)) {
          if (moment(newLastDate).isAfter(tempLastDate)) {
            tempLastDate = newLastDate;
          }

          if (this.validate(item)) {
            responseArray.push(item);
          }
        } else {
          break;
        }
      }

      if (lastDate != tempLastDate)
        this._setLastDate(tempLastDate);

      for (const responseItem of responseArray.reverse()) {
        this.$emit(
          responseItem,
          {
            id: responseItem.id,
            summary: this.getSummary(responseItem),
            ts: responseItem.timestamp,
          },
        );
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
