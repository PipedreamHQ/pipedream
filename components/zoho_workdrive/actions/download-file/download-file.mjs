import app from "../../zoho_workdrive.app.mjs";
import { getFilePath } from "../../common/utils.mjs";
import { LIMIT } from "../../common/constants.mjs";
import fs from "fs";

export default {
  key: "zoho_workdrive-download-file",
  name: "Download File to Tmp Direcory",
  description: "Download a file to the /tmp directory. [See the documentation](https://workdrive.zoho.com/apidocs/v1/filesfolders/downloadserverfile)",
  version: "0.0.1",
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
  },
  methods: {
    downloadFile({
      fileId, ...args
    }) {
      return this.app._makeRequest({
        url: `https://download.${this.app.$auth.base_api_uri}/v1/workdrive/download/${fileId}`,
        responseType: "arraybuffer",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const fileName = this.fileName || this.fileId.label;
    const filePath = getFilePath(fileName);

    const fileContent = await this.downloadFile({
      fileId: this.fileId.value,
    });

    fs.writeFileSync(filePath, fileContent);

    $.export("$summary", `The file was successfully downloaded to \`${filePath}\`.`);

    return filePath;
  },
};
