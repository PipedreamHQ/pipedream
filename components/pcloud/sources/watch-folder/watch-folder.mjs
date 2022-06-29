import pcloud from "../../pcloud.app.mjs";
import get from "lodash/get.js";

export default {
  key: "pcloud-watch-folder",
  name: "Watch Folder",
  description:
    "Emit new event when a file is created or modified in the specified folder.",
  version: "0.0.1",
  type: "source",
  dedupe: "last",
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
      description: `Select a **Folder** to watch for changes.
        \\
        Alternatively, you can provide a custom *Folder ID*.`,
    },
    event: {
      type: "string",
      label: "Folder Event",
      options: [
        "Created",
        "Modified",
      ],
      description:
        "Specify when to emit an event related to a given folder. Note that pCloud preserves files' `created` and `modified` timestamps on upload. If manually uploading via pCloud's `uploadfile` API, these timestamps can be set by specifying the `mtime` and `ctime` parameters, respectively.",
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
      const pCloudContentsData = await this.getContents();
      const hasContents = get(pCloudContentsData, [
        "contents",
      ]);
      if (hasContents) {
        for (const folderItem of pCloudContentsData.contents) {
          if (!folderItem.isfolder) {
            files.push(folderItem);
            if (files.length == 10) {
              break;
            }
          }
        }
      } else {
        console.log("No data available, skipping iteration");
      }
      files.forEach(this.emitpCloudEvent);
      this.db.set("lastPolledTime", +Date.now());
    },
  },
  methods: {
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
      const eventDate = pcloudEvent[this.event.toLowerCase()];
      const ts = +new Date(eventDate);
      return {
        id: ts,
        summary: `${this.event} file "${pcloudEvent.name}"`,
        ts,
      };
    },
  },
  async run() {
    const lastPolledTime = this.db.get("lastPolledTime");
    const files = [];
    const pCloudContentsData = await this.getContents();
    const hasContents = get(pCloudContentsData, [
      "contents",
    ]);
    if (hasContents) {
      for (const folderItem of pCloudContentsData.contents) {
        if (!folderItem.isfolder) {
          let fileTime = +new Date(folderItem[this.event.toLowerCase()]);
          if (fileTime > lastPolledTime) {
            files.push(folderItem);
          }
        }
      }
    } else {
      console.log("No data available, skipping iteration");
    }
    files.forEach(this.emitpCloudEvent);
    this.db.set("lastPolledTime", +Date.now());
  },
};
