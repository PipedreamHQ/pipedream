import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import mailosaur from "../../mailosaur.app.mjs";

export default {
  props: {
    mailosaur,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    serverId: {
      propDefinition: [
        mailosaur,
        "serverId",
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
    getData() {
      return {};
    },
    dataValidation() {
      return true;
    },
    getOtherOpts() {
      return {};
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const otherOpts = this.getOtherOpts();
      const response = this.mailosaur.paginate({
        fn: this.getFunction(),
        params: {
          receivedAfter: lastDate,
          server: this.serverId,
        },
        ...otherOpts,
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item.received) <= Date.parse(lastDate)) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(responseArray[0].received);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: Date.parse(item.received),
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
    await this.dataValidation();
    await this.emitEvent();
  },
};
