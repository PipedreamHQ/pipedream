import common from "../common-webhook.mjs";
import {
  MY_DRIVE_VALUE,
  GOOGLE_DRIVE_NOTIFICATION_ADD,
  GOOGLE_DRIVE_NOTIFICATION_CHANGE,
  GOOGLE_DRIVE_NOTIFICATION_UPDATE,
} from "../../common/constants.mjs";
import commonDedupeChanges from "../common-dedupe-changes.mjs";
import { stashFile } from "../../common/utils.mjs";

export default {
  ...common,
  key: "google_drive-changes-to-files-in-drive",
  name: "Changes to Files in Drive",
  description: "Emit new event when a change is made to one of the specified files. [See the documentation](https://developers.google.com/drive/api/v3/reference/changes/watch)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    infoAlert: {
      type: "alert",
      alertType: "info",
      content: "This source uses `changes.watch` and supports watching 10+ files. To watch for changes to fewer than 10 files, you may want to use the **Changes to Specific Files** source instead (uses `files.watch`).",
    },
    ...common.props,
    drive: {
      type: "string",
      label: "Drive",
      description: "Defaults to `My Drive`. To use a [Shared Drive](https://support.google.com/a/users/answer/9310351), use the **Changes to Specific Files (Shared Drive)** source instead.",
      optional: true,
      default: MY_DRIVE_VALUE,
    },
    files: {
      type: "string[]",
      label: "Files",
      description: "The files you want to watch for changes.",
      options({ prevContext }) {
        const { nextPageToken } = prevContext;
        return this.googleDrive.listFilesOptions(nextPageToken, this.getListFilesOpts());
      },
    },
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
    ...commonDedupeChanges.props,
  },
  hooks: {
    async deploy() {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - 30);
      const timeString = daysAgo.toISOString();

      const args = this.getListFilesOpts({
        q: `mimeType != "application/vnd.google-apps.folder" and modifiedTime > "${timeString}" and trashed = false`,
        fields: "files",
        pageSize: 5,
      });

      const { files } = await this.googleDrive.listFilesInPage(null, args);

      await this.processChanges(files);
    },
    ...common.hooks,
  },
  methods: {
    ...common.methods,
    getUpdateTypes() {
      return [
        GOOGLE_DRIVE_NOTIFICATION_ADD,
        GOOGLE_DRIVE_NOTIFICATION_CHANGE,
        GOOGLE_DRIVE_NOTIFICATION_UPDATE,
      ];
    },
    generateMeta(data, headers) {
      const {
        id: fileId,
        name: fileName,
        modifiedTime: tsString,
      } = data;
      const ts = Date.parse(tsString);
      const resourceState = headers && headers["x-goog-resource-state"];

      const summary = resourceState
        ? `${resourceState.toUpperCase()} - ${fileName || "Untitled"}`
        : fileName || "Untitled";

      return {
        id: `${fileId}-${ts}`,
        summary,
        ts,
      };
    },
    isFileRelevant(file) {
      return this.files.includes(file.id);
    },
    getChanges(headers) {
      if (!headers) {
        return {
          change: { },
        };
      }
      return {
        change: {
          state: headers["x-goog-resource-state"],
          resourceURI: headers["x-goog-resource-uri"],
          changed: headers["x-goog-changed"], // "Additional details about the changes. Possible values: content, parents, children, permissions"
        },
      };
    },
    async processChange(file, headers) {
      const changes = this.getChanges(headers);
      const fileInfo = await this.googleDrive.getFile(file.id);
      if (this.includeLink) {
        fileInfo.file = await stashFile(file, this.googleDrive, this.dir);
      }
      const eventToEmit = {
        file: fileInfo,
        ...changes,
      };
      const meta = this.generateMeta(fileInfo, headers);
      this.$emit(eventToEmit, meta);
    },
    async processChanges(changedFiles, headers) {
      console.log(`Processing ${changedFiles.length} changed files`);
      console.log(`Changed files: ${JSON.stringify(changedFiles, null, 2)}!!!`);
      console.log(`Files: ${this.files}!!!`);

      const filteredFiles = this.checkMinimumInterval(changedFiles);
      for (const file of filteredFiles) {
        if (!this.isFileRelevant(file)) {
          console.log(`Skipping event for irrelevant file ${file.id}`);
          continue;
        }
        await this.processChange(file, headers);
      }
    },
  },
};
