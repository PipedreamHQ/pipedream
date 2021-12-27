import dropbox from "../../dropbox.app.mjs";
import isNil from "lodash/isNil.js";
import isEmpty from "lodash/isEmpty.js";

export default {
  name: "Create folder",
  description: "Create a folder. [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesCreateFolderV2__anchor)",
  key: "dropbox-create-folder",
  version: "0.0.4",
  type: "action",
  props: {
    dropbox,
    name: {
      type: "string",
      label: "Folder name",
      description: "Your new folder name.",
    },
    path: {
      propDefinition: [
        dropbox,
        "pathFolder",
      ],
      optional: true,
      description: "The Path in the user's Dropbox to create the folder. If not filled, it will be created on the root folder.(Please use a valid path to filter the values)",
    },
    autorename: {
      type: "boolean",
      label: "Autorename",
      description: "If there's a conflict, have the Dropbox server try to autorename the folder to avoid the conflict.",
      default: true,
    },
  },
  async run({ $ }) {
    const {
      autorename,
      name,
    } = this;

    let { path } = this;

    // Check for empties path
    if (isNil(path) || isEmpty(path)) {
      path = "/";
    }

    // Check if last char is not /
    if (path[path.length - 1] !== "/") {
      path += "/";
    }

    const res = await this.dropbox.createFolder({
      autorename,
      path: path + name,
    });
    $.export("$summary", "Folder successfully created");
    return res;
  },
};
