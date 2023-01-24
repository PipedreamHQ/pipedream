import base from "../common/base.mjs";

export default {
  ...base,
  key: "digitalocean_spaces-file-deleted",
  name: "File Deleted",
  description: "Emit new event when a file is deleted from a DigitalOcean Spaces bucket",
  version: "0.0.2",
  type: "source",
  hooks: {
    async deploy() {
      const files = await this.aws.listFiles({
        Bucket: this.bucket,
        Prefix: this.prefix,
      });
      this.setFileList(files);
    },
  },
  methods: {
    ...base.methods,
    updateFileList(listedFiles) {
      const currentList = this.getFileList();
      this.setFileList(listedFiles);
      return currentList.filter(({ Key }) => !listedFiles.map(this.getKey).includes(Key));
    },
    emitEvents(files) {
      files.forEach((file) => this.$emit(file, {
        id: file.Key,
        summary: `File deleted: ${file.Key}`,
        ts: file.LastModified,
      }));
    },
  },
};
