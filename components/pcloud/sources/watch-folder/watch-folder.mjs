import pcloud from "../../pcloud.app.mjs";

export default {
  key: "pcloud-watch-folder",
  name: "Watch Folder",
  description: "Emit new event when a file is created or modified in the specified folder.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    pcloud,
    db: "$.service.db",
    timer: {
      label: "Polling schedule",
      description: "Pipedream polls pCloud for events on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // by default, run every 15 minutes.
      },
    },
    folderId: {
      propDefinition: [
        pcloud,
        "folderId",
      ],
      description: "Select a **Folder** to watch for changes. Alternatively, you can provide a custom *Folder ID*.",
    },
    event: {
      type: "string",
      label: "Folder Event",
      options: [
        "Created",
        "Modified",
      ],
      description: "Specify when to emit an event related to a given folder.",
      default: "Created",
    },
    showDeleted: {
      propDefinition: [
        pcloud,
        "showDeleted",
      ],
    },
  },
  hooks: {
    async deploy() {
      const files = [];
      const { contents } = await this.getContents();
      if (!contents) {
        return;
      }
      for (const folderItem of contents) {
        if (this.isRelevant(folderItem)) {
          files.push(folderItem);
          if (files.length == 10) {
            break;
          }
        }
      }
      files.forEach(this.emitpCloudEvent);
      this._setPreviousFiles(contents);
    },
  },
  methods: {
    _getPreviousFiles() {
      return this.db.get("previousFiles");
    },
    _setPreviousFiles(files) {
      const key = this.getFileKey();
      const previousFiles = files.filter((file) => file[key]).map((file) => ({
        [file[key]]: true,
      }));
      this.db.set("previousFiles", previousFiles);
    },
    getFileKey() {
      return this.event === "Created"
        ? "fileid"
        : "hash";
    },
    async getContents() {
      return this.pcloud._withRetries(() =>
        this.pcloud.listContents(
          this.folderId,
          false,
          this.showDeleted,
          false,
          false,
        ));
    },
    emitpCloudEvent(pCloudEvent) {
      const metadata = this.getEventData(pCloudEvent);
      this.$emit(pCloudEvent, metadata);
    },
    getEventData(pcloudEvent) {
      const key = this.getFileKey();
      return {
        id: pcloudEvent[key],
        summary: `${this.event} file "${pcloudEvent.name}"`,
        ts: Date.now(),
      };
    },
    isRelevant(folderItem, previousFiles = []) {
      const key = this.getFileKey();
      return !folderItem.isFolder && !previousFiles[folderItem[key]];
    },
  },
  async run() {
    const previousFiles = this._getPreviousFiles();
    const files = [];
    const { contents } = await this.getContents();
    if (!contents) {
      console.log("No data available, skipping iteration");
      return;
    }
    for (const folderItem of contents) {
      if (this.isRelevant(folderItem, previousFiles)) {
        files.push(folderItem);
      }
    }
    files.forEach(this.emitpCloudEvent);
    this._setPreviousFiles(contents);
  },
};
