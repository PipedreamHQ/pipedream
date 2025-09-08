import common from "../common/common.mjs";
import { Readable } from "stream";
import { fileTypeFromBuffer } from "file-type";

export default {
  key: "box-new-file",
  name: "New File Event",
  description: "Emit new event when a new file is uploaded to a target. [See the documentation](https://developer.box.com/reference/post-webhooks)",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  ...common,
  props: {
    ...common.props,
    webhookTarget: {
      propDefinition: [
        common.props.app,
        "webhookTarget",
        () => ({
          type: "folder",
        }),
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
    ...common.methods,
    getTriggers() {
      return [
        "FILE.UPLOADED",
      ];
    },
    getSummary(event) {
      return  `New file uploaded event with ID(${event.id})`;
    },
    async stashFile(event) {
      const response = await this.app.downloadFile({
        fileId: event.source.id,
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response);
      const filepath = `${event.source.id}/${event.source.name}`;
      const type = await fileTypeFromBuffer(buffer);
      const file = await this.dir.open(filepath).fromReadableStream(
        Readable.from(buffer),
        type?.mime,
        buffer.length,
      );
      return await file.withoutPutUrl().withGetUrl();
    },
  },
  async run(event) {
    if (this.includeLink) {
      event.body.file = await this.stashFile(event.body);
    }
    this.$emit(
      event.body,
      this.getMetadata(event.body),
    );
  },
};
