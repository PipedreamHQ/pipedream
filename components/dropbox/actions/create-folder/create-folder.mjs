import dropbox from "../../dropbox.app.mjs";

export default {
  name: "Create folder",
  description: "Create a Folder. [See the documentation](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesCreateFolderV2__anchor)",
  key: "dropbox-create-folder",
  version: "0.0.10",
  type: "action",
  props: {
    dropbox,
    name: {
      type: "string",
      label: "Folder Name",
      description: "Your new folder name.",
    },
    path: {
      propDefinition: [
        dropbox,
        "path",
        () => ({
          filter: ({ metadata: { metadata: { [".tag"]: type } } }) => type === "folder",
        }),
      ],
      optional: true,
      description: "Type the folder name to search for it in the user's Dropbox. If not filled, it will be created in the root folder.",
    },
    autorename: {
      type: "boolean",
      label: "Autorename",
      description: "If there's a conflict, have Dropbox try to autorename the folder to avoid the conflict.",
      default: true,
    },
  },
  async run({ $ }) {
    const {
      autorename,
      name,
      path,
    } = this;

    const res = await this.dropbox.createFolder({
      autorename,
      path: this.dropbox.getNormalizedPath(path, true) + name,
    });
    $.export("$summary", `Folder successfully created: \`${res.result.metadata.name}\``);
    return res;
  },
};
