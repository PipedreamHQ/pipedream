import app from "../../zoho_workdrive.app.mjs";
import { getFilePath } from "../../common/utils.mjs";
import { LIMIT } from "../../common/constants.mjs";
import {
  additionalFolderProps, findMaxFolderId,
} from "../../common/additionalFolderProps.mjs";
import fs from "fs";

export default {
  key: "zoho_workdrive-download-file",
  name: "Download File to Tmp Direcory",
  description: "Download a file to the /tmp directory. [See the documentation](https://workdrive.zoho.com/apidocs/v1/filesfolders/downloadserverfile)",
  version: "0.0.6",
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
      label: "Folder ID",
      description: "The unique ID of the folder where file is located. Select a folder to view its subfolders.",
      reloadProps: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async additionalProps() {
    const folderProps = await additionalFolderProps.call(this);
    const props = {
      ...folderProps,
    };
    props.fileId = {
      type: "string",
      label: "File ID",
      description: "The unique ID of the file to download.",
      withLabel: true,
      options: async ({ page }) => {
        const num = this.findMaxFolderId(this);
        const limit = this.getLimit();
        const { data } = await this.app.listFiles({
          folderId: num > 0
            ? this[`folderId${num}`]
            : this.folderId,
          filter: "allfiles",
          params: new URLSearchParams({
            "page[limit]": limit,
            "page[offset]": limit * page,
          }).toString(),
        });
        return data.map(({
          id, attributes,
        }) => ({
          value: id,
          label: attributes.name,
        }));
      },
    };
    props.fileName = {
      type: "string",
      label: "Filename",
      description: "What to name the new file saved to /tmp directory",
      optional: true,
    };
    return props;
  },
  methods: {
    findMaxFolderId,
    getLimit() {
      return LIMIT;
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
