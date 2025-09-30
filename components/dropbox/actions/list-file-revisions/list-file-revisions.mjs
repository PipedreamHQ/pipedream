import consts from "../../common/consts.mjs";
import dropbox from "../../dropbox.app.mjs";

export default {
  name: "List File Revisions",
  description: "Retrieves a list of file revisions needed to recover previous content. [See the documentation](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesListRevisions__anchor)",
  key: "dropbox-list-file-revisions",
  version: "0.0.12",
  type: "action",
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "path",
        () => ({
          initialOptions: [],
        }),
      ],
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Determines the behavior of the API in listing the revisions for a given file path or id. In `path` (default) mode, all revisions at the same file path as the latest file entry are returned. If revisions with the same file id are desired, then mode must be set to `id`.",
      optional: true,
      options: consts.LIST_FILE_REVISIONS_OPTIONS,
    },
    limit: {
      propDefinition: [
        dropbox,
        "limit",
      ],
      description: "The maximum number of revision entries returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      path,
      mode,
      limit,
    } = this;
    const res = await this.dropbox.listFileRevisions({
      path: this.dropbox.getPath(path),
      mode: mode
        ? {
          ".tag": mode,
        }
        : undefined,
      limit,
    });
    $.export("$summary", `File revisions for file "${path?.label || path}" successfully fetched`);
    return res;
  },
};
