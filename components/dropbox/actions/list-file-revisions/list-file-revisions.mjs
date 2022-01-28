import consts from "../../consts.mjs";
import dropbox from "../../dropbox.app.mjs";

export default {
  name: "List File Revisions",
  description: "Retrieves a list of file revisions needed to recover previous content. [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesListRevisions__anchor)",
  key: "dropbox-list-file-revisions",
  version: "0.0.1",
  type: "action",
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "pathFile",
      ],
      description: "The file path for the file whose revisions you'd like to list.",
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Determines the behavior of the API in listing the revisions for a given file path or id.",
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
      path: path?.value || path,
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
