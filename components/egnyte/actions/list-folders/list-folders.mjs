import egnyte from "../../egnyte.app.mjs";

const MAX_RECURSIVE_DEPTH = 10;

export default {
  key: "egnyte-list-folders",
  name: "List Folders",
  description: "List folders in your Egnyte workspace. [See the documentation](https://developers.egnyte.com/api-docs/read/file-system-management-api-documentation)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    egnyte,
    folderPath: {
      propDefinition: [
        egnyte,
        "folderPath",
      ],
      description: "List folders within this folder. Search for a folder to select or enter a folder path manually. Defaults to the root folder.",
      optional: true,
    },
    includeSubfolders: {
      type: "boolean",
      label: "Include Subfolders",
      description: "If `true`, the response will contain all nested subfolders.",
      optional: true,
      default: false,
    },
  },
  methods: {
    _normalizeFolderPath(p) {
      return p
        ? String(p).replace(/^\//, "")
        : "";
    },
    _countFoldersInTree(nodes) {
      let n = 0;
      for (const node of nodes) {
        n += 1;
        n += this._countFoldersInTree(node.folders || []);
      }
      return n;
    },
  },
  async run({ $ }) {
    const basePath = this._normalizeFolderPath(this.folderPath);

    let folders;
    if (this.includeSubfolders) {
      const buildTree = async (folderPath, depthFromRoot) => {
        const { folders: children = [] } = await this.egnyte.getFolder({
          $,
          folderPath,
        });
        const out = [];
        for (const folder of children) {
          const node = {
            ...folder,
            folders: [],
          };
          if (depthFromRoot < MAX_RECURSIVE_DEPTH) {
            const subPath = this._normalizeFolderPath(folder.path);
            if (subPath) {
              node.folders = await buildTree(subPath, depthFromRoot + 1);
            }
          }
          out.push(node);
        }
        return out;
      };
      folders = await buildTree(basePath, 1);
    } else {
      const res = await this.egnyte.getFolder({
        $,
        folderPath: basePath,
      });
      folders = res.folders || [];
    }

    const count = this.includeSubfolders
      ? this._countFoldersInTree(folders)
      : folders?.length || 0;
    $.export("$summary", `Successfully retrieved ${count} folder${count != 1
      ? "s"
      : ""}.`);
    return folders;
  },
};
