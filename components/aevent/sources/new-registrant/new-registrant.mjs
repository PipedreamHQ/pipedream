import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import aevent from "../../aevent.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "aevent-new-registrant",
  name: "New Registrant",
  description: "Emit new event when a new registrant is added. [See the Documentation](https://app.aevent.com/#/settings)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    aevent,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
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
      const response = this.aevent.paginate({
        fn: this.aevent.listRegistrants,
        params: {
          lastDate,
        },
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        if (item.registrationTime <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(responseArray[0].registrationTime);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.uuid,
          summary: `New registrant: ${item.email || item.uuid}`,
          ts: item.registrationTime,
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
