import app from "../../zoho_workdrive.app.mjs";

export default {
  key: "zoho_workdrive-download-file",
  name: "Download File to Tmp Direcory",
  version: "0.0.1",
  description: "Download a file to the /tmp directory. [See the documentation](https://workdrive.zoho.com/apidocs/v1/filesfolders/downloadserverfile)",
  type: "action",
  props: {
    app,
    teamId: {
      propDefinition: [
        app,
        "teamId",
      ],
    },
    folderId: {
      propDefinition: [
        app,
        "parentId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
      label: "Folder Id",
      description: "The unique ID of the folder where file is located.",
    },
    fileId: {
      propDefinition: [
        app,
        "fileId",
        ({ folderId }) => ({
          folderId,
        }),
      ],
    },
  },
  async run() {
    const response = await this.app.downloadFile({
      fileId: this.fileId,
    });

    return response;
  },
};
