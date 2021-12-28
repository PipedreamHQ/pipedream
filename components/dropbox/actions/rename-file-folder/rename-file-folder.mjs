import dropbox from "../../dropbox.app.mjs";
import get from "lodash/get.js";

export default {
  name: "Rename a File/Folder",
  description: "Renames a file or folder in the user's Dropbox [See the docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesMoveV2__anchor)",
  key: "dropbox-rename-file-folder",
  version: "0.0.7",
  type: "action",
  props: {
    dropbox,
    pathFrom: {
      propDefinition: [
        dropbox,
        "pathFileFolder",
      ],
      label: "Path From",
      description: "The file that you want to rename.",
    },
    newName: {
      type: "string",
      label: "New Name",
      description: "The file new name. (Please use the extension)",
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
      newName,
      autorename,
      allowOwnershipTransfer,
    } = this;

    const normalizedPathFrom = get(pathFrom, "value", pathFrom);
    const splitedPath = normalizedPathFrom.split("/");
    splitedPath[splitedPath.length - 1] = newName;
    const res = await this.dropbox.filesMove({
      from_path: normalizedPathFrom,
      to_path: splitedPath.join("/"),
      autorename,
      allow_ownership_transfer: allowOwnershipTransfer,
    });
    $.export("$summary", "File/Folder successfully renamed");
    return res;
  },
};
