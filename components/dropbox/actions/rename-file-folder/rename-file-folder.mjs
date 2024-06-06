import dropbox from "../../dropbox.app.mjs";

export default {
  name: "Rename a File/Folder",
  description: "Renames a file or folder in the user's Dropbox [See the docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesMoveV2__anchor)",
  key: "dropbox-rename-file-folder",
  version: "0.0.9",
  type: "action",
  props: {
    dropbox,
    pathFrom: {
      propDefinition: [
        dropbox,
        "path",
        () => ({
          initialOptions: [],
          filter: ({ metadata: { metadata: { [".tag"]: type } } }) => [
            "file",
            "folder",
          ].includes(type),
        }),
      ],
      label: "Path From",
      description: "Type the file or folder name to search for it in the user's Dropbox.",
    },
    newName: {
      type: "string",
      label: "New Name",
      description: "The file's new name (make sure to include the file extension).",
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
      newName,
      autorename,
      allowOwnershipTransfer,
    } = this;

    const normalizedPathFrom = this.dropbox.getPath(pathFrom);
    const splitedPath = normalizedPathFrom.split("/");
    splitedPath[splitedPath.length - 1] = newName;
    const res = await this.dropbox.filesMove({
      from_path: normalizedPathFrom,
      to_path: splitedPath.join("/"),
      autorename,
      allow_ownership_transfer: allowOwnershipTransfer,
    });
    $.export("$summary", `"${normalizedPathFrom}" successfully renamed to "${newName}"`);
    return res;
  },
};
