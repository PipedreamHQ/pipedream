import app from "../../d2l_brightspace.app.mjs";

export default {
  key: "d2l_brightspace-list-dropbox-folders",
  name: "List Dropbox Folders",
  description: "Retrieves all dropbox folders (assignments) for a specific course from D2L Brightspace. [See the documentation](https://docs.valence.desire2learn.com/res/dropbox.html)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    orgUnitId: {
      propDefinition: [
        app,
        "orgUnitId",
      ],
    },
  },
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
    idempotentHint: true,
  },
  async run({ $ }) {
    const response = await this.app.listDropboxFolders({
      orgUnitId: this.orgUnitId,
      $,
    });

    const folders = Array.isArray(response)
      ? response
      : [];
    $.export("$summary", `Successfully retrieved ${folders.length} dropbox folder${folders.length === 1
      ? ""
      : "s"}`);
    return folders;
  },
};
