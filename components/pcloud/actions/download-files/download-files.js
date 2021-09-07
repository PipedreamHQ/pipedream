const pcloud = require("../../pcloud.app.js");

module.exports = {
  key: "pcloud-download-files",
  name: "Download File(s)",
  description:
    "Download one or more files.",
  version: "0.0.1",
  type: "action",
  props: {
    pcloud,
    urls: {
      type: "string[]",
      label: "URLs",
      description: "URL(s) of the files to download.",
    },
    folderId: {
      propDefinition: [
        pcloud,
        "folderId",
      ],
      description: "ID of the folder, in which to download the files.",
    },
  },
  async run() {
    return await this.pcloud._withRetries(
      () => this.pcloud.downloadFiles(
        this.urls,
        this.folderId,
      ),
    );
  },
};
