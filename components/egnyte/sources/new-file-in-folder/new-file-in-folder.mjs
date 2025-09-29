import common from "../common/base.mjs";
import { Readable } from "stream";
import { fileTypeFromBuffer } from "file-type";

export default {
  ...common,
  key: "egnyte-new-file-in-folder",
  name: "New File in Folder",
  description: "Emit new event when a file is added within the specified folder in Egnyte. [See the documentation](https://developers.egnyte.com/docs/read/File_System_Management_API_Documentation#List-File-or-Folder)",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
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
    getResourceType() {
      return "files";
    },
    generateMeta(file) {
      return {
        id: file.entry_id,
        summary: `New file: ${file.name}`,
        ts: file.uploaded,
      };
    },
    async stashFile(item) {
      const response = await this.egnyte.downloadFile({
        folderPath: this.folderPath,
        filename: item.name,
      });
      const buffer = Buffer.from(response);
      const filepath = `${item.entry_id}/${item.name}`;
      const type = await fileTypeFromBuffer(buffer);
      const file = await this.dir.open(filepath).fromReadableStream(
        Readable.from(buffer),
        type?.mime,
        buffer.length,
      );
      return await file.withoutPutUrl().withGetUrl();
    },
    async emitEvents(items) {
      for (const item of items) {
        if (this.includeLink) {
          item.file = await this.stashFile(item);
        }
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      };
    },
  },
};
