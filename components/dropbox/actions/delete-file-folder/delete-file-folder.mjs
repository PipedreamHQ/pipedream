import dropbox from "../../dropbox.app.mjs";

export default {
  name: "Delete a File/Folder",
  description: "Permanently removes a file/folder from the server. [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesDeleteV2__anchor)",
  key: "dropbox-delete-file-folder",
  version: "0.0.9",
  type: "action",
  props: {
    dropbox,
    path: {
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
      description: "Type the file or folder name to search for it in the user's Dropbox.",
    },
  },
  async run({ $ }) {
    const { path } = this;
    const res = await this.dropbox.deleteFileFolder({
      path: this.dropbox.getPath(path),
    });
    $.export("$summary", `"${path?.label || path}" successfully deleted`);
    return res;
  },
};
