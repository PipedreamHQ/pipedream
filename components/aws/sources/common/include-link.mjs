import { Readable } from "stream";
import { fileTypeFromBuffer } from "file-type";

export default {
  props: {
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
    async streamToBuffer(stream) {
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    },
    async stashFile(item) {
      const { Body } = await this.getObject({
        Bucket: item.bucket.name,
        Key: item.object.key.replace(/\+/g, " "),
      });
      const filepath = `${item.bucket.name}/${item.object.key}`;
      const buffer = await this.streamToBuffer(Body);
      const type = await fileTypeFromBuffer(buffer);
      // Upload the attachment to the configured directory (File Stash) so it
      // can be accessed later.
      const file = await this.dir.open(filepath).fromReadableStream(
        Readable.from(buffer),
        type?.mime,
        buffer.length,
      );
      // Return file details and temporary download link:
      // { path, get_url, s3Key, type }
      return await file.withoutPutUrl().withGetUrl();
    },
    async processEvent(event) {
      const { Message: rawMessage } = event.body;
      const {
        Records: s3Events = [],
        Event: eventType,
      } = JSON.parse(rawMessage);

      if (eventType === "s3:TestEvent") {
        console.log("Received initial test event. Skipping...");
        return;
      }

      for (const s3Event of s3Events) {
        const meta = this.generateMeta(s3Event);
        let { s3: item } = s3Event;
        if (this.includeLink) {
          item.file = await this.stashFile(item);
        }
        this.$emit(item, meta);
      }
    },
  },
};
