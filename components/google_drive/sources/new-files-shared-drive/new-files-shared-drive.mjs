import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import googleDrive from "../../google_drive.app.mjs";
import sourceComponent from "../new-files-instant/new-files-instant.mjs";
import sampleEmit from "../new-files-instant/test-event.mjs";

export default {
  key: "google_drive-new-files-shared-drive",
  name: "New Files (Shared Drive)",
  description: "Emit new event when a new file is added in your shared Google Drive",
  version: "0.1.2",
  type: "source",
  dedupe: "unique",
  props: {
    googleDrive,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Interval to poll the Google Drive API for new files",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    drive: {
      propDefinition: [
        googleDrive,
        "sharedDrive",
      ],
      description: "Select a [Shared Drive](https://support.google.com/a/users/answer/9310351) from this list",
      optional: false,
    },
    folders: sourceComponent.props.folders,
    includeLink: {
      label: "Include Link",
      type: "boolean",
      description: "Upload file to your File Stash and emit temporary download link to the file. Google Workspace documents will be converted to PDF. See [the docs](https://pipedream.com/docs/connect/components/files) to learn more about working with files in Pipedream.",
      default: false,
      optional: true,
    },
    dir: {
      type: "dir",
      accessMode: "write",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Get initial page token for change tracking
      const startPageToken = await this.googleDrive.getPageToken(this.getDriveId());
      this._setPageToken(startPageToken);
      this._setLastFileCreatedTime(Date.now());

      // Emit the most recent files
      await sourceComponent.hooks.deploy.bind(this)();
    },
  },
  methods: sourceComponent.methods,
  async run() {
    const pageToken = this._getPageToken();

    const driveId = this.getDriveId();
    const changedFilesStream = this.googleDrive.listChanges(pageToken, driveId);
    for await (const changedFilesPage of changedFilesStream) {
      const { nextPageToken } = changedFilesPage;

      // Process all the changed files retrieved from the current page
      await this.processChanges();

      // After successfully processing the changed files, we store the page
      // token of the next page
      this._setPageToken(nextPageToken);
    }
  },
  sampleEmit,
};
