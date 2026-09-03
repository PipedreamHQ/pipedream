// x-pd-ai: optimized
import app from "../../gong.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "gong-list-library-folder-calls",
  name: "List Calls In Library Folder",
  description: "List the calls curated into a Gong library folder and return an array. "
  + "The `note` is the comment whoever filed the call left on it, and `snippet` marks the highlighted stretch of "
  + `the call when one was saved. An empty folder returns an empty array. [See the documentation](${constants.DOCS_URL}#get-/v2/library/folder-content)`,
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "Gong's numeric identifier for the library folder (up to 20 digits, e.g. `7065430206503861336`). Run **List Library Folders** first to obtain valid IDs.",
    },
  },
  async run({ $: step }) {
    const {
      app,
      folderId,
    } = this;

    const {
      calls, name,
    } = await app.listLibraryFolderContent({
      step,
      params: {
        folderId,
      },
    });

    const results = calls || [];

    step.export("$summary", `Found ${utils.pluralize(results.length, "call")} in library folder \`${name || folderId}\``);

    return results;
  },
};
