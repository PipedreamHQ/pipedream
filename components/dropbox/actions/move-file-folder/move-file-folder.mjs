import dropbox from "../../dropbox.app.mjs";

export default {
  name: "Move a File/Folder",
  description: "Moves a file or folder to a different location in the user's Dropbox [See the docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesMoveV2__anchor)",
  key: "dropbox-move-file-folder",
  version: "0.0.9",
  type: "action",
  props: {
    dropbox,
    pathFrom: {
      propDefinition: [
        dropbox,
        "pathFileFolder",
        () => ({
          omitRootFolder: true,
        }),
      ],
      label: "Path from",
      description: "The file/folder that you want to move.",
    },
    pathTo: {
      propDefinition: [
        dropbox,
        "pathFolder",
      ],
      label: "Path to",
      description: "The new path of your file/folder",
    },
    autorename: {
      type: "boolean",
      label: "Autorename",
      description: "If there's a conflict, have Dropbox try to autorename the folder to avoid the conflict.",
      optional: true,
    },
    allowOwnershipTransfer: {
      type: "boolean",
      label: "Allow ownership transfer",
      description: "Allow moves by owner even if it would result in an ownership transfer for the content being moved. This does not apply to copies.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      pathFrom,
      autorename,
      allowOwnershipTransfer,
      pathTo,
    } = this;

    let normalizedPathTo = this.dropbox.getPath(pathTo);
    const normalizedPathFrom = this.dropbox.getPath(pathFrom);

    // Add file/folder name to end of pathTo
    const splited = normalizedPathFrom.split("/");
    const fileName = splited[splited.length - 1];
    normalizedPathTo += `/${fileName}`;

    const res = await this.dropbox.filesMove({
      from_path: normalizedPathFrom,
      to_path: normalizedPathTo,
      autorename,
      allow_ownership_transfer: allowOwnershipTransfer,
    });
    $.export("$summary", `"${normalizedPathFrom}" successfully moved to "${normalizedPathTo}"`);
    return res;
  },
};
