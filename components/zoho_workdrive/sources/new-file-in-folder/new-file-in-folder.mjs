import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../zoho_workdrive.app.mjs";
import { Readable } from "stream";
import { fileTypeFromBuffer } from "file-type";
import sampleEmit from "./test-event.mjs";

export default {
  key: "zoho_workdrive-new-file-in-folder",
  name: "New File In Folder",
  version: "0.1.0",
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
    includeLink: {
      label: "Include Link",
      type: "boolean",
      description: "Upload attachment to your File Stash and emit temporary download link to the file. See [the docs](https://pipedream.com/docs/connect/components/files) to learn more about working with files in Pipedream.",
      default: false,
      optional: true,
    },
    dir: {
      type: "dir",
      accessMode: "write",
      optional: true,
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async stashFile(item) {
      const fileContent = await this.app.downloadFile({
        fileId: item.id,
      });
      const buffer = Buffer.from(fileContent, "base64");
      const filepath = `${item.id}/${item.attributes.name}`;
      const type = await fileTypeFromBuffer(buffer);
      const file = await this.dir.open(filepath).fromReadableStream(
        Readable.from(buffer),
        type?.mime,
        buffer.length,
      );
      // Return file details and temporary download link:
      // { path, get_url, s3Key, type }
      return await file.withoutPutUrl().withGetUrl();
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
        filter: "allfiles",
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
        if (this.includeLink) {
          item.file = await this.stashFile(item);
        }
        this.$emit(
          item,
          {
            id: item.id,
            summary: `A new file with id: "${item.id}" was created!`,
            ts: item.attributes.created_time,
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
  sampleEmit,
};
