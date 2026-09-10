// x-pd-ai: optimized
import app from "../../gong.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "gong-list-library-folders",
  name: "List Library Folders",
  description: "List the public folders in the Gong call library and return an array. The library is where teams curate calls into "
  + "collections such as \"Win/Loss\" or \"Onboarding\", so this is the way to find calls a human has already picked out rather than "
  + "searching the whole call history. Folders nest: a folder with a `parentFolderId` of `null` is a root folder. "
  + `Private and archived folders are never returned. [See the documentation](${constants.DOCS_URL}#get-/v2/library/folders)`,
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    // Gong's reference marks workspaceId optional on this endpoint, but the API
    // answers 400 "Bad request" when it is omitted, so it is required here.
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
      description: "The workspace whose library folders to list, as a Gong workspace ID (e.g. `5877789441548580962`). Use the **List Workspace ID Options** action to discover workspace IDs.",
    },
  },
  async run({ $: step }) {
    const {
      app,
      workspaceId,
    } = this;

    const { folders } = await app.listLibraryFolders({
      step,
      params: {
        workspaceId,
      },
    });

    const results = folders || [];

    step.export("$summary", `Found ${utils.pluralize(results.length, "library folder")}`);

    return results;
  },
};
