import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import screendesk from "../../screendesk.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "screendesk-new-recording",
  name: "New Recording",
  version: "0.0.1",
  description: "Emit new event when a new recording is created is sent or received.",
  type: "source",
  dedupe: "unique",
  props: {
    screendesk,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Screendesk on this schedule",
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
    async startEvent(maxResults = 0) {
      const { screendesk } = this;

      const lastId = this._getLastId();
      const items = screendesk.paginate({
        fn: screendesk.listRecordings,
        maxResults,
      });

      let responseArray = [];

      for await (const item of items) {
        if (item.id <= lastId) break;
        responseArray.push(item);
      }
      if (responseArray.length) this._setLastId(responseArray[0].id);

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: `A new recording with id: "${item.id}" was ${item.recording_type.toLowerCase()}!`,
            ts: new Date(),
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
  sampleEmit,
};
