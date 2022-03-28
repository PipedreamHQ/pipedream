const common = require("../common/timer-based");

module.exports = {
  ...common,
  key: "new-file",
  name: "New File",
  description:
    "Emit new event when a new file is added to the File Manager of the connected Mailchimp account.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    fileType: {
      type: "string",
      label: "File type",
      description:
        "The file type you'd like to watch for in the File Manager. Supported file types: 'image' or 'file', use 'all' for both.",
      options: [
        "image",
        "file",
        "all",
      ],
      default: "all",
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const config = {
        count: 10,
      };
      const fileStream = this.mailchimp.getFileStream(this.fileType, config);
      for await (const file of fileStream) {
        this.processEvent(file);
        this.setDbServiceVariable("lastCreatedAt", file.created_at);
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
      count: 1000,
      sinceCreatedAt
    };
    const fileStream = this.mailchimp.getFileStream(this.fileType, config);
    for await (const file of fileStream) {
      this.processEvent(file);
      this.setDbServiceVariable("lastCreatedAt", sinceCreatedAt);
    }
  },
};
