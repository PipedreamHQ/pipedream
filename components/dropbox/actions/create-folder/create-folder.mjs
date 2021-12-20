import dropbox from "../../dropbox.app.mjs";

export default {
  name: "Create folder",
  description: "Create a folder. [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesCreateFolderV2__anchor)",
  key: "dropbox-create-folder",
  version: "0.0.2",
  type: "action",
  props: {
    dropbox,
    path: {
      type: "string",
      label: "Path",
      description: "Path in the user's Dropbox to create. (It must start with `/`)",
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
      path,
      autorename,
    } = this;
    const res = await this.dropbox.createFolder({
      autorename,
      path: path[0] === "/"
        ? path
        : `/${path}`,
    });
    $.export("$summary", "Folder successfully created");
    return res;
  },
};
