import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Send Created",
  key: "sendoso-new-send",
  description: "Emit new event when a new send is created. [See docs here](https://sendoso.docs.apiary.io/#reference/send-management/get-all-sent-giftsitems/get-sent-gifts)",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Sendoso API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    ...common.methods,
    getDataToEmit({
      id, touch_name,
    }) {
      return {
        id: id,
        summary: this.getSummary(touch_name, id),
        ts: new Date().getTime(),
      };
    },
    getFieldId() {
      return "id";
    },
    getSummary(name, id) {
      return `New send created: ${name} (${id})`;
    },
    async proccessEvent() {
      const lastId = this._getLastId();
      const data = await this.sendoso.getSentGifts();

      const list = data.filter((item) => (item.id > lastId));

      list.reverse();
      this.emitEvent(list);
    },
    async startRun() {
      const data = await this.sendoso.getSentGifts();
      if (data.length > 20) data.length = 20;
      data.reverse();
      this.emitEvent(data);
    },
  },
};

