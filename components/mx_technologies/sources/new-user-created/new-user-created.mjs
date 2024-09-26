import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import mxTechnologies from "../../mx_technologies.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "mx_technologies-new-user-created",
  name: "New User Created",
  description: "Emit new event for each new user created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    mxTechnologies,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    generateMeta(event) {
      return {
        id: event.guid,
        summary: `New user created with GUID ${event.guid}`,
        ts: new Date(),
      };
    },
    async startEvent(maxResults = false) {
      const lastId = this._getLastId();

      let data = this.mxTechnologies.paginate({
        fn: this.mxTechnologies.listUsers,
      });

      const dataArray = [];
      const responseArray = [];
      let count = 0;
      for await (const item of data) {
        if (maxResults && (++count >= maxResults)) break;
        dataArray.push(item);
      }

      for (const item of dataArray.reverse()) {
        if (item.guid === lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastId(responseArray[0].guid);

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
  sampleEmit,
};
