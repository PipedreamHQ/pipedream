import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import zohoBugtracker from "../../zoho_bugtracker.app.mjs";

export default {
  key: "zoho_bugtracker-new-bug-reported",
  name: "New Bug Reported",
  version: "0.0.1",
  description: "Emit new event when a new bug is reported.",
  type: "source",
  dedupe: "unique",
  props: {
    zohoBugtracker,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Zoho BugTracker on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    portalId: {
      propDefinition: [
        zohoBugtracker,
        "portalId",
      ],
    },
    projectId: {
      propDefinition: [
        zohoBugtracker,
        "projectId",
        ({ portalId }) => ({
          portalId,
        }),
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults) {
      const {
        zohoBugtracker,
        portalId,
        projectId,
      } = this;

      const lastDate = this._getLastDate();
      let responseArray = [];

      const items = zohoBugtracker.paginate({
        fn: zohoBugtracker.listBugs,
        params: {
          sort_by: "created_time",
        },
        portalId,
        projectId,
        maxResults,
      });

      for await (const item of items) {
        if (item.created_time_long === lastDate) {
          break;
        }
        responseArray.push(item);
      }

      if (responseArray[0]) {
        this._setLastDate(responseArray[0].created_time_long);
      }

      for (const responseItem of responseArray.reverse()) {
        this.$emit(
          responseItem,
          {
            id: responseItem.id_string,
            summary: `A new bug with id: "${responseItem.id_string}" was reported!`,
            ts: responseItem.created_time_long,
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
