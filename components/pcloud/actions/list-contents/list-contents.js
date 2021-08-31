const common = require("../../common");
const { pcloud } = common.props;

module.exports = {
  key: "pcloud-list-contents",
  name: "List Contents.",
  description: "Lists the metadata of the specified folder's contents.",
  version: "0.0.9",
  type: "action",
  props: {
    pcloud,
    domainLocation: {
      propDefinition: [
        pcloud,
        "domainLocation",
      ],
    },
    path: {
      propDefinition: [
        pcloud,
        "path",
      ],
      description:
        "Path to the folder list contents. If `path` or `folderId` are not present, then root folder is used.",
    },
    folderId: {
      propDefinition: [
        pcloud,
        "folderId",
      ],
      description: "ID of the folder to list contents.",
    },
    //TODO: maybe needed to change `recursive`, `nofiles`, `noshares`, to boolean
    recursive: {
      type: "integer",
      label: "Recursive?",
      description:
        "If is set full directory tree will be returned, which means that all directories will have contents filed.",
      optional: true,
    },
    showdeleted: {
      propDefinition: [
        pcloud,
        "showdeleted",
      ],
      description:
        "If is set, deleted files and folders that can be undeleted will be displayed.",
      optional: true,
    },
    nofiles: {
      type: "integer",
      label: "No Files?",
      description:
        "If is set, only the folder (sub)structure will be returned.",
      optional: true,
    },
    noshares: {
      type: "integer",
      label: "No Shares?",
      description:
        "If is set, only user's own folders and files will be displayed.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    console.log(this.pcloud._getToken());
    return await this.pcloud.listContents(
      this.domainLocation,
      this.path,
      this.folderId,
      this.recursive,
      this.showdeleted,
      this.nofiles,
      this.noshares,
    );
  },
};
