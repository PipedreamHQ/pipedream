import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import zohoBugtracker from "../../zoho_bugtracker.app.mjs";

export default {
  key: "zoho_bugtracker-new-bug-reported",
  name: "New Bug Reported",
  version: "0.0.2",
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
          sort_by: "DESC(created_time)",
        },
        resourceKey: "issues",
        portalId,
        projectId,
        maxResults,
      });

      for await (const item of items) {
        if (Date.parse(item.created_time) <= lastDate) {
          break;
        }
        responseArray.push(item);
      }
      if (responseArray[0]) {
        this._setLastDate(Date.parse(responseArray[0].created_time));
      }

      for (const responseItem of responseArray.reverse()) {
        this.$emit(
          responseItem,
          {
            id: responseItem.id,
            summary: `New Bug with ID: "${responseItem.id}"`,
            ts: Date.parse(responseItem.created_time),
          },
        );
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(10);
    },
  },
  async run() {
    await this.startEvent();
  },
};
