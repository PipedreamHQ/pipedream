import dropbox from "../../dropbox.app.mjs";

export default {
  name: "Move a File/Folder",
  description: "Moves a file or folder to a different location in the user's Dropbox [See the docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesMoveV2__anchor)",
  key: "dropbox-move-file-folder",
  version: "0.0.2",
  type: "action",
  props: {
    dropbox,
    pathFrom: {
      propDefinition: [
        dropbox,
        "pathFileFolder",
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

    let normalizedPathTo = pathTo?.value || pathTo;
    const normalizedPathFrom = pathFrom?.value || pathFrom;

    // If path is a file, we need to move it as a file
    if (pathFrom?.type == "file" && pathFrom.value) {
      const splited = normalizedPathFrom.split("/");
      const fileName = splited[splited.length - 1];
      normalizedPathTo = `${pathTo?.value || pathTo}/${fileName}`;
    }

    const res = await this.dropbox.filesMove({
      from_path: pathFrom.value,
      to_path: normalizedPathTo,
      autorename,
      allow_ownership_transfer: allowOwnershipTransfer,
    });
    $.export("$summary", `"${normalizedPathFrom}" successfully moved to "${normalizedPathTo}"`);
    return res;
  },
};
