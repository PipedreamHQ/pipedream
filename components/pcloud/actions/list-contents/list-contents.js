const pcloud = require("../../pcloud.app.js");

module.exports = {
  key: "pcloud-list-contents",
  name: "List Contents.",
  description: "Lists the metadata of the specified folder's contents.",
  version: "0.0.1",
  type: "action",
  props: {
    pcloud,
    folderId: {
      propDefinition: [
        pcloud,
        "folderId",
      ],
      description: "ID of the folder to list contents.",
    },
    recursive: {
      type: "boolean",
      label: "Recursive?",
      description:
        "Return contents of the folder and all subfolders, recursively.",
      default: false,
    },
    showdeleted: {
      propDefinition: [
        pcloud,
        "showdeleted",
      ],
      description:
            "If is set, deleted files and folders that can be undeleted will be displayed.",
      default: false,
    },
    nofiles: {
      type: "boolean",
      label: "No Files?",
      description:
            "If is set, only the folder (sub)structure will be returned.",
      default: false,
    },
    noshares: {
      type: "boolean",
      label: "Exclude Shares?",
      description: "Exclude shared files and folders.",
      default: true,
    },
  },
  async run() {
    return await this.pcloud._withRetries(
      () => this.pcloud.listContents(
        this.folderId,
        this.recursive,
        this.showdeleted,
        this.nofiles,
        this.noshares,
      ),
    );
  },
};
