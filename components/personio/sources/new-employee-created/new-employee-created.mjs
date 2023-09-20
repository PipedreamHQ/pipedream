import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import personio from "../../personio.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "personio-new-employee-created",
  name: "New Employee Created",
  version: "0.0.1",
  description: "Emit new event when a new employee is created.",
  type: "source",
  dedupe: "unique",
  props: {
    personio,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Personio on this schedule",
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
      const { personio } = this;

      const lastId = this._getLastId();
      const items = personio.paginate({
        fn: personio.listEmployees,
        maxResults,
      });

      let responseArray = [];

      for await (const item of items) {
        responseArray.push(item);
        if (item.attributes?.id?.value <= lastId) break;
      }
      if (responseArray.length) this._setLastId(responseArray[0].attributes?.id?.value);

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.attributes?.id?.value,
            summary: `A new employee with id: "${item.attributes?.id?.value}" was created!`,
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
