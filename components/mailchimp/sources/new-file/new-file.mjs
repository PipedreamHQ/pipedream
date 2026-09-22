import common from "../common/timer-based.mjs";
import constants from "../constants.mjs";

export default {
  ...common,
  key: "mailchimp-new-file",
  name: "New File",
  description: "Emit new event when a new file is added to the File Manager of the connected Mailchimp account.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    fileType: {
      type: "string",
      label: "File type",
      description: "The file type you'd like to watch for in the File Manager. Supported file types: 'image' or 'file', use 'all' for both.",
      options: constants.FILE_TYPES,
      default: "all",
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const count = 10;
      const config = {
        count,
      };
      const fileStream = this.mailchimp.getFileStream(this.fileType, config);
      let i = 0;
      for await (const file of fileStream) {
        if (i < count) {
          this.processEvent(file);
          this.setDbServiceVariable("lastCreatedAt", file.created_at);
        }
        i++;
      }
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const ts = Date.parse(eventPayload.created_at);
      return {
        id: eventPayload.id,
        summary: `A new file "${eventPayload.name}" was added.`,
        ts,
      };
    },
  },
  async run() {
    const sinceCreatedAt = this.getDbServiceVariable("lastCreatedAt");
    const config = {
      count: 3,
      sinceCreatedAt,
    };
    const fileStream = this.mailchimp.getFileStream(this.fileType, config);
    for await (const file of fileStream) {
      this.processEvent(file);
      this.setDbServiceVariable("lastCreatedAt", file.created_at);
    }
  },
};
