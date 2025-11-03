import { ConfigurationError } from "@pipedream/platform";
import common from "../common/base.mjs";
import { Readable } from "stream";
import { fileTypeFromBuffer } from "file-type";
import { findMaxFolderId } from "../../common/additionalFolderProps.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_workdrive-new-file-in-folder",
  name: "New File In Folder",
  version: "0.2.1",
  description: "Emit new event when a new file is created in a specific folder.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    folderType: {
      propDefinition: [
        common.props.app,
        "folderType",
      ],
    },
    folderId: {
      propDefinition: [
        common.props.app,
        "parentId",
        ({
          teamId, folderType,
        }) => ({
          teamId,
          folderType,
        }),
      ],
      label: "Folder ID",
      description: "Select the unique ID of the folder. Select a folder to view its subfolders.",
      optional: true,
      reloadProps: true,
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
    ...common.methods,
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
      const num = findMaxFolderId(this);
      const folderId = num > 0
        ? this[`folderId${num}`]
        : this.folderId;

      if (!folderId) {
        throw new ConfigurationError("Please select a Folder ID or type in a Folder ID.");
      }

      const lastDate = this._getLastDate();
      let maxDate = lastDate;
      const items = this.app.paginate({
        fn: this.app.listFiles,
        maxResults,
        filter: "allfiles",
        sort: "created_time",
        folderId,
      });

      let responseArray = [];

      for await (const item of items) {
        const createdTime = item.attributes.created_time_in_millisecond;
        if (createdTime > lastDate) {
          responseArray.push(item);
          if (createdTime > maxDate) {
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
            summary: `A new file with ID: "${item.id}" was created!`,
            ts: item.attributes.created_time_in_millisecond,
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
  sampleEmit,
};
