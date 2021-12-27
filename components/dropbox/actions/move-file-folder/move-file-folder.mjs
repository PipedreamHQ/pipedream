import dropbox from "../../dropbox.app.mjs";

export default {
  name: "Move a File/Folder",
  description: "Moves a file or folder to a different location in the user's Dropbox [See the docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesMoveV2__anchor)",
  key: "dropbox-move-file-folder",
  version: "0.0.1",
  type: "action",
  props: {
    dropbox,
    pathFrom: {
      propDefinition: [
        dropbox,
        "pathFileFolder",
      ],
      description: "The file/folder that you want to move.",
    },
    pathTo: {
      propDefinition: [
        dropbox,
        "pathFolder",
      ],
      description: "The new path",
    },
    autorename: {
      type: "boolean",
      label: "Autorename",
      description: "If there's a conflict, have the Dropbox server try to autorename the file to avoid the conflict.",
      optional: true,
    },
    allowOwnershipTransfer: {
      type: "boolean",
      label: "Allow Ownership Transfer",
      description: "Allow moves by owner even if it would result in an ownership transfer for the content being moved. This does not apply to copies.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      pathFrom,
      pathTo,
      autorename,
      allowOwnershipTransfer,
    } = this;

    const res = await this.dropbox.filesMove({
      from_path: pathFrom,
      to_path: pathTo,
      autorename,
      allow_ownership_transfer: allowOwnershipTransfer,
    });
    $.export("$summary", "File/folder successfully moved");
    return res;
  },
};
