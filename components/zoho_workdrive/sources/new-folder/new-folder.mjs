import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../zoho_workdrive.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "zoho_workdrive-new-folder",
  name: "New Folder",
  version: "0.0.3",
  description: "Emit new event when a new folder is created in a specific folder.",
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
    folderType: {
      propDefinition: [
        app,
        "folderType",
      ],
    },
    folderId: {
      propDefinition: [
        app,
        "parentId",
        ({
          teamId, folderType,
        }) => ({
          teamId,
          folderType,
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
      let maxDate = lastDate;
      const items = app.paginate({
        fn: app.listFiles,
        maxResults,
        filter: "folder",
        sort: "created_time",
        folderId,
      });

      let responseArray = [];

      for await (const item of items) {
        const createdTime = item.attributes.created_time;
        if (new Date(createdTime) > new Date(lastDate)) {
          responseArray.push(item);
          if (new Date(createdTime) > new Date(maxDate)) {
            maxDate = createdTime;
          }
        }
      }
      this._setLastDate(maxDate);

      for (const item of responseArray) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: `A new folder with id: "${item.id}" was created!`,
            ts: item.attributes.created_time,
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
