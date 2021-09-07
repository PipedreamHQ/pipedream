const pcloud = require("../../pcloud.app.js");
const get = require("lodash/get");

module.exports = {
  key: "pcloud-watch-folder",
  name: "Watch Folder",
  description:
    "Emits an event when a file is created or modified in the specified folder.",
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
      description: "ID of the folder you'd like to watch for created or modified files.",
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
    showdeleted: {
      propDefinition: [
        pcloud,
        "showdeleted",
      ],
    },
  },
  hooks: {
    async deploy() {
      const files = [];
      const pCloudContentsData = await this.pcloud._withRetries(
        () => this.pcloud.listContents(
          this.folderId,
          false,
          this.showdeleted,
          false,
          false,
        ),
      );
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
    emitpCloudEvent(pCloudEvent) {
      const metadata = this.getEventData(pCloudEvent);
      this.$emit(pCloudEvent, metadata);
    },
    getEventData(pcloudEvent) {
      const newOrModified = [
        "Created",
      ].includes(this.event)
        ? "New created"
        : "Modified";
      const eventDate = [
        "Created",
      ].includes(this.event)
        ? pcloudEvent.created
        : pcloudEvent.modified;
      const ts = +new Date(eventDate);
      return {
        id: ts,
        summary: `${newOrModified} file "${pcloudEvent.name}"`,
        ts,
      };
    },
  },
  async run() {
    const lastPolledTime = this.db.get("lastPolledTime");
    const files = [];
    const pCloudContentsData = await this.pcloud._withRetries(
      () => this.pcloud.listContents(
        this.folderId,
        false,
        this.showdeleted,
        false,
        false,
      ),
    );
    const hasContents = get(pCloudContentsData, [
      "contents",
    ]);
    if (hasContents) {
      for (const folderItem of pCloudContentsData.contents) {
        if (!folderItem.isfolder) {
          let fileTime;
          if ([
            "Created",
          ].includes(this.event)) {
            fileTime = +new Date(folderItem.created);
          } else {
            fileTime = +new Date(folderItem.modified);
          }
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
