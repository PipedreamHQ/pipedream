import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../zoho_workdrive.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "zoho_workdrive-new-file-in-folder",
  name: "New File In Folder",
  version: "0.0.2",
  description: "Emit new event when a new file is created in a specific folder.",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Zoho WorkDrive on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    teamId: {
      propDefinition: [
        app,
        "teamId",
      ],
    },
    folderId: {
      propDefinition: [
        app,
        "parentId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
      label: "Folder Id",
      description: "The unique ID of the folder.",
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults = 0) {
      const {
        app,
        folderId,
      } = this;

      const lastDate = this._getLastDate();
      const items = app.paginate({
        fn: app.listFiles,
        maxResults,
        filter: "allfiles",
        sort: "created_time",
        folderId,
      });

      let responseArray = [];

      for await (const item of items) {
        if (new Date(item.created_time) <= new Date(lastDate)) break;
        responseArray.push(item);
      }
      if (responseArray.length) this._setLastDate(responseArray[0].created_time);

      for (const item of responseArray) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: `A new file with id: "${item.id}" was created!`,
            ts: item.created_time,
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
