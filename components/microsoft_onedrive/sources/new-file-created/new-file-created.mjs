import onedrive from "../../microsoft_onedrive.app.mjs";
import base from "../common/base.mjs";
import { Readable } from "stream";
import httpRequest from "../../common/httpRequest.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  type: "source",
  key: "microsoft_onedrive-new-file-created",
  name: "New File Created (Instant)",
  description: "Emit new event when a new file is created in a OneDrive drive",
  version: "0.1.0",
  dedupe: "unique",
  props: {
    ...base.props,
    drive: {
      propDefinition: [
        onedrive,
        "drive",
      ],
      description: "The drive to monitor for new files. If not specified, the personal OneDrive will be monitored.",
      optional: true,
    },
    folder: {
      propDefinition: [
        onedrive,
        "folder",
        ({ drive }) => ({
          driveId: drive,
        }),
      ],
      description: "The OneDrive folder to watch for new files (leave empty to watch the entire drive). Use the \"Load More\" button to load subfolders.",
      optional: true,
    },
    fileTypes: {
      propDefinition: [
        onedrive,
        "fileTypes",
      ],
    },
    includeLink: {
      label: "Include Link",
      type: "boolean",
      description: "Upload file to your File Stash and emit temporary download link to the file. See [the docs](https://pipedream.com/docs/connect/components/files) to learn more about working with files in Pipedream.",
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
    ...base.methods,
    httpRequest,
    getDeltaLinkParams() {
      const params = {};
      if (this.drive) {
        params.driveId = this.drive;
      }
      if (this.folder) {
        params.folderId = this.folder;
      }
      return params;
    },
    isItemTypeRelevant(driveItem) {
      const fileType = driveItem?.file?.mimeType;
      return this.fileTypes?.length
        ? !!(this.fileTypes.find((type) => fileType?.includes(type)))
        : true;
    },
    isItemRelevant(driveItem) {
      if (!driveItem?.file) {
        return false;
      }
      return !this.folder || driveItem?.parentReference?.id === this.folder;
    },
    async stashFile(driveItem) {
      const response = await this.httpRequest({
        url: `items/${driveItem.id}/content`,
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response, "base64");
      const filepath = `${driveItem.id}/${driveItem.name}`;
      const file = await this.dir.open(filepath).fromReadableStream(
        Readable.from(buffer),
        driveItem.file.mimeType,
        buffer.length,
      );
      return await file.withoutPutUrl().withGetUrl();
    },
    async processEvent(driveItem) {
      if (this.includeLink) {
        driveItem.fileURL = await this.stashFile(driveItem);
      }
      const meta = this.generateMeta(driveItem);
      this.$emit(driveItem, meta);
    },
  },
  sampleEmit,
};
