const { uuid } = require("uuidv4");
const googleDrive = require("../../google_drive.app.js");

module.exports = {
  key: "google_drive-new-files-instant",
  name: "New Files (Instant)",
  description:
    "Emits a new event any time a new file is added in your linked Google Drive",
  version: "0.0.4",
  dedupe: "unique",
  props: {
    googleDrive,
    db: "$.service.db",
    http: "$.interface.http",
    drive: { propDefinition: [googleDrive, "watchedDrive"] },
    folders: {
      type: "string[]",
      label: "Folders",
      description: "(Optional) The folders you want to watch for changes. Leave blank to watch for any new file in the Drive.",
      optional: true,
      default: [],
      async options({ prevContext }) {
        const { nextPageToken } = prevContext;
        let results;
        if (this.drive === "myDrive") {
          results = await this.googleDrive.listFiles({
            pageToken: nextPageToken,
            q: "mimeType = 'application/vnd.google-apps.folder'",
          });
        } else {
          results = await this.googleDrive.listFiles({
            pageToken: nextPageToken,
            corpora: "drive",
            driveId: this.drive,
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            q: "mimeType = 'application/vnd.google-apps.folder'",
          });
        }
        return results;
      },
    },
    timer: {
      label: "Push notification renewal schedule",
      description:
        "The Google Drive API requires occasional renewal of push notification subscriptions. **This runs in the background, so you should not need to modify this schedule**.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 60 * 24,
      },
    },
  },
  hooks: {
    async activate() {
      // Called when a component is created or updated. Handles all the logic
      // for starting and stopping watch notifications tied to the desired files.

      const channelID = this.db.get("channelID") || uuid();

      const {
        startPageToken,
        expiration,
        resourceId,
      } = await this.googleDrive.activateHook(
        channelID,
        this.http.endpoint,
        this.drive === "myDrive" ? null : this.drive
      );

      // We use and increment the pageToken as new changes arrive, in run()
      this.db.set("pageToken", startPageToken);

      // Save metadata on the subscription so we can stop / renew later
      // Subscriptions are tied to Google's resourceID, "an opaque value that
      // identifies the watched resource". This value is included in request headers
      this.db.set("subscription", { resourceId, expiration });
      this.db.set("channelID", channelID);

      const lastFileCreatedTime = this.db.get("lastFileCreatedTime") || Date.now();
      this.db.set("lastFileCreatedTime", lastFileCreatedTime);
    },
    async deactivate() {
      const channelID = this.db.get("channelID");
      const { resourceId } = this.db.get("subscription");

      // Reset DB state before anything else
      this.db.set("subscription", null);
      this.db.set("channelID", null);
      this.db.set("pageToken", null);

      await this.googleDrive.deactivateHook(channelID, resourceId);
    },
  },
  methods: {
    shouldProcess(file) {
      const watchedFolders = new Set(this.folders);

      return (
        watchedFolders.size == 0 ||
        file.parents.some((p) => watchedFolders.has(p))
      );
    },
  },
  async run(event) {
    // This function is polymorphic: it can be triggered as a cron job, to make sure we renew
    // watch requests for specific files, or via HTTP request (the change payloads from Google)

    let subscription = this.db.get("subscription");
    let channelID = this.db.get("channelID");
    let pageToken = this.db.get("pageToken");

    // Component was invoked by timer
    if (event.interval_seconds) {
      const {
        newChannelID,
        newPageToken,
        expiration,
        resourceId,
      } = await this.googleDrive.invokedByTimer(
        this.drive,
        subscription,
        this.http.endpoint,
        channelID,
        pageToken
      );

      this.db.set("subscription", { expiration, resourceId });
      this.db.set("pageToken", newPageToken);
      this.db.set("channelID", newChannelID);
      return;
    }

    const { headers } = event;

    if (!this.googleDrive.checkHeaders(headers, subscription, channelID)) {
      return;
    }

    const {
      changedFiles,
      newStartPageToken,
    } = await this.googleDrive.getChanges(
      pageToken,
      this.drive === "myDrive" ? null : this.drive
    );

    this.db.set("pageToken", newStartPageToken);

    const lastFileCreatedTime = new Date(this.db.get("lastFileCreatedTime"));
    let maxCreatedTime = lastFileCreatedTime;

    for (const file of changedFiles) {
      const fileInfo = await this.googleDrive.getFile(file.id);
      const createdTime = new Date(fileInfo.createdTime);
      if (createdTime.getTime() > maxCreatedTime.getTime())
        maxCreatedTime = createdTime;
      if (!this.shouldProcess(fileInfo)) continue;
      if (createdTime.getTime() <= lastFileCreatedTime.getTime()) continue;
      this.$emit(fileInfo, {
        summary: `New File ID: ${file.id}`,
        id: file.id,
        ts: createdTime.getTime(),
      });
    }

    this.db.set("lastFileCreatedTime", maxCreatedTime);
  },
};
