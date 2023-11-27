import { axios } from "@pipedream/platform";
import common from "../common/rest-api.mjs";

export default {
  ...common,
  key: "pcloud-save-zip",
  name: "Save Zip",
  description: "Create a zip file in the user's filesystem. [See the docs here](https://docs.pcloud.com/methods/archiving/savezip.html)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    folderIds: {
      propDefinition: [
        common.props.pcloud,
        "folderId",
      ],
      type: "integer[]",
      description: "Select folders to include in the zip file",
      default: [],
      optional: true,
    },
    fileIds: {
      propDefinition: [
        common.props.pcloud,
        "fileId",
      ],
      type: "integer[]",
      description: "Select files to include in the zip file",
      optional: true,
    },
    toFolderId: {
      propDefinition: [
        common.props.pcloud,
        "folderId",
      ],
      label: "Destination Folder ID",
      description: "Select a **Destination Folder** to receive the zip file.",
    },
    outputFile: {
      type: "string",
      label: "Output Filename",
      description: "The filename of the output zip file that will be saved.`",
    },
  },
  methods: {
    ...common.methods,
    async saveZip({
      $, params,
    }) {
      return axios($, {
        url: `https://${this.pcloud.$auth.hostname}/savezip`,
        params: {
          ...params,
          auth: await this.getAuth($),
        },
      });
    },
  },
  async run({ $ }) {
    const response = await this.saveZip({
      params: {
        tofolderid: this.toFolderId,
        toname: this.outputFile,
        folderids: this.folderIds?.length
          ? this.folderIds.join()
          : undefined,
        fileids: this.fileIds?.length
          ? this.fileIds.join()
          : undefined,
      },
      $,
    });

    return response;
  },
};
