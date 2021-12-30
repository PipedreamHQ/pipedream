import dropbox from "../../dropbox.app.mjs";
import common from "../../common.mjs";

export default {
  name: "Create folder",
  description: "Create a folder. [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesCreateFolderV2__anchor)",
  key: "dropbox-create-folder",
  version: "0.0.1",
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
  methods: {
    ...common.methods,
  },
  async run({ $ }) {
    const {
      autorename,
      name,
      path,
    } = this;

    const res = await this.dropbox.createFolder({
      autorename,
      path: this.getNormalizedPath(path, true) + name,
    });
    $.export("$summary", "Folder successfully created");
    return res;
  },
};
