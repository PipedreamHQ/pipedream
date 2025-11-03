import common from "../common/common.mjs";
import { Readable } from "stream";
import { fileTypeFromBuffer } from "file-type";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "openai-new-file-created",
  name: "New File Created",
  description: "Emit new event when a new file is created in OpenAI. [See the documentation](https://platform.openai.com/docs/api-reference/files/list)",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    purpose: {
      propDefinition: [
        common.props.openai,
        "purpose",
      ],
      description: "If specified, events will only be emitted for files with the specified purpose.",
      optional: true,
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
    ...common.methods,
    getData() {
      return this.openai.listFiles({
        purpose: this.purpose,
      });
    },
    getMeta(item) {
      return {
        id: item.id,
        summary: `New File: ${item.filename}`,
        ts: item.created_at * 1000,
      };
    },
    async stashFile(item) {
      const response = await this.openai.retrieveFileContent({
        file_id: item.id,
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response);
      const filepath = `${item.id}/${item.filename}`;
      const type = await fileTypeFromBuffer(buffer);
      const file = await this.dir.open(filepath).fromReadableStream(
        Readable.from(buffer),
        type?.mime,
        buffer.length,
      );
      return await file.withoutPutUrl().withGetUrl();
    },
    async getAndProcessItems(maxEvents) {
      const lastCreated = this._getLastCreated();
      const { data } = await this.getData();
      if (!data?.length) {
        return;
      }
      this._setLastCreated(data[0].created_at);
      const items = data?.filter(({ created_at }) => created_at >= lastCreated).reverse();
      let count = 0;
      for (const item of items) {
        if (!maxEvents || count < maxEvents) {
          if (this.includeLink) {
            try {
              item.file = await this.stashFile(item);
            } catch (error) {
              item.file = `Could not upload file ${item.filename } to File Stash`;
            }
          }
          this.$emit(item, this.getMeta(item));
          count++;
        }
      }
    },
  },
  sampleEmit,
};
