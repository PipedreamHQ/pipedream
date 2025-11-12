import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import coldstream from "../../diabatix_coldstream.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "diabatix_coldstream-simulation-completed",
  name: "New Simulation Completed",
  description: "Emit new event when a simulation has been successfully completed.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    coldstream,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    organizationId: {
      propDefinition: [
        coldstream,
        "organizationId",
      ],
    },
    projectId: {
      propDefinition: [
        coldstream,
        "projectId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
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
      const lastId = this._getLastId();

      const response = this.coldstream.paginate({
        fn: this.coldstream.listCases,
        maxResults,
        projectId: this.projectId,
        params: {
          "Status": 2,
          "SortField.Name": "created",
          "SortField.Order": 1,
        },
      });

      let responseArray = [];

      for await (const item of response) {
        if (item.id <= lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastId(responseArray[0].id);

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: `New simulation completed with Id: ${item.id}`,
          ts: Date.parse(item.created),
        });
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
