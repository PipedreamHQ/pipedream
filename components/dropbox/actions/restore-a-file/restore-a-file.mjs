import dropbox from "../../dropbox.app.mjs";
import get from "lodash/get.js";

export default {
  name: "Restore a File",
  description: "Restores a previous file version. [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesRestore__anchor)",
  key: "dropbox-restore-a-file",
  version: "0.0.7",
  type: "action",
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "pathFile",
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
      path: get(path, "value", path),
      rev,
    });
    $.export("$summary", "File successfully restored to selected revision");
    return res;
  },
};
