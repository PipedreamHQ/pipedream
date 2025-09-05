import app from "../../zoho_workdrive.app.mjs";
import { getFilePath } from "../../common/utils.mjs";
import { LIMIT } from "../../common/constants.mjs";
import fs from "fs";

export default {
  key: "zoho_workdrive-download-file",
  name: "Download File to Tmp Direcory",
  description: "Download a file to the /tmp directory. [See the documentation](https://workdrive.zoho.com/apidocs/v1/filesfolders/downloadserverfile)",
  version: "0.0.5",
  type: "action",
  props: {
    app,
    teamId: {
      propDefinition: [
        app,
        "teamId",
      ],
    },
    folderType: {
      propDefinition: [
        app,
        "folderType",
      ],
    },
    folderId: {
      propDefinition: [
        app,
        "parentId",
        ({
          teamId, folderType,
        }) => ({
          teamId,
          folderType,
        }),
      ],
      label: "Folder Id",
      description: "The unique ID of the folder where file is located.",
    },
    fileId: {
      type: "string",
      label: "File Id",
      description: "The unique ID of the file to download.",
      withLabel: true,
      async options({ page }) {
        const { data } = await this.app.listFiles({
          folderId: this.folderId,
          filter: "allfiles",
          params: new URLSearchParams({
            "page[limit]": LIMIT,
            "page[offset]": LIMIT * page,
          }).toString(),
        });
        return data.map(({
          id, attributes,
        }) => ({
          value: id,
          label: attributes.name,
        }));
      },
    },
    fileName: {
      type: "string",
      label: "Filename",
      description: "What to name the new file saved to /tmp directory",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const fileId = this.fileId?.value ?? this.fileId;
    const fileName = this.fileName ?? this.fileId?.label ?? "file";
    const filePath = getFilePath(fileName);

    const fileContent = await this.app.downloadFile({
      fileId,
    });

    fs.writeFileSync(filePath, fileContent);

    $.export("$summary", `The file was successfully downloaded to \`${filePath}\`.`);

    return filePath;
  },
};
