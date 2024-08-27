import base from "../common/base.mjs";

export default {
  ...base,
  key: "digitalocean_spaces-file-uploaded",
  name: "New File Uploaded",
  description: "Emit new event when a file is uploaded to a DigitalOcean Spaces bucket",
  version: "0.0.2",
  type: "source",
  methods: {
    ...base.methods,
    updateFileList(listedFiles) {
      const currentList = this.getFileList();
      this.setFileList(listedFiles.map(this.getKeyTimestamp));
      return listedFiles.filter((file) => !currentList.includes(this.getKeyTimestamp(file)));
    },
    emitEvents(files) {
      files.forEach((file) => this.$emit(file, {
        id: this.getKeyTimestamp(file),
        summary: `New file uploaded: ${file.Key}`,
        ts: file.LastModified,
      }));
    },
  },
};
