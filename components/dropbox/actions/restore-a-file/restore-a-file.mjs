import dropbox from "../../dropbox.app.mjs";

export default {
  name: "Restore a File",
  description: "Restores a previous file version. [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesRestore__anchor)",
  key: "dropbox-restore-a-file",
  version: "0.0.8",
  type: "action",
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "pathFile",
        () => ({
          omitRootFolder: true,
        }),
      ],
      description: "The path to save the restored file.",
    },
    rev: {
      propDefinition: [
        dropbox,
        "fileRevision",
        ({ path }) => ({
          path,
        }),
      ],
      description: "The revision to restore.",
    },
  },
  async run({ $ }) {
    const {
      path,
      rev,
    } = this;

    const res = await this.dropbox.restoreFile({
      path: this.dropbox.getPath(path),
      rev: rev?.value || rev,
    });
    $.export("$summary", `"${path?.label || path}" successfully restored to "${rev?.label || rev}" revision`);
    return res;
  },
};
