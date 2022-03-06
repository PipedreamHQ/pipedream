const common = require("../common/timer-based");
const moment = require("moment");

module.exports = {
  ...common,
  key: "mailchimp-new-file",
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
      const fileType = this.fileType === "all" ?
        null :
        this.fileType;
      const config = {
        count: 10,
        offset: 0,
        type: fileType,
        beforeCreatedAt: null,
        sinceCreatedAt: null,
      };
      const mailchimpFilesInfo = await this.mailchimp.getAllFiles(config);
      const { files: mailchimpFiles = [] } = mailchimpFilesInfo;
      if (!mailchimpFiles.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      this.db.set("lastCreatedAt", mailchimpFiles[0].created_at);
      mailchimpFiles.forEach(this.processEvent);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const ts = +new Date(eventPayload.created_at);
      return {
        id: eventPayload.id,
        summary: `A new file "${eventPayload.name}" was added.`,
        ts,
      };
    },
    processEvent(eventPayload) {
      const meta = this.generateMeta(eventPayload);
      this.$emit(eventPayload, meta);
    },
  },
  async run() {
    const beforeCreatedAt = moment().toISOString();
    const sinceCreatedAt = this.db.get("lastCreatedAt");
    const fileType = this.fileType === "all" ?
      null :
      this.fileType;
    let mailchimpFilesInfo;
    let mailchimpFiles;
    let offset = 0;
    const config = {
      count: 1000,
      type: fileType,
      beforeCreatedAt,
      sinceCreatedAt,
    };
    do {
      config.offset = offset;
      mailchimpFilesInfo = await this.mailchimp.getAllFiles(config);
      mailchimpFiles = mailchimpFilesInfo.files;
      if (!mailchimpFiles.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      mailchimpFiles.forEach(this.processEvent);
      this.db.set("lastCreatedAt", mailchimpFiles[0].created_at);
      offset = offset + mailchimpFiles.length;
    } while (mailchimpFiles.length > 0);
  },
};
