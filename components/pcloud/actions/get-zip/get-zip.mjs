import { axios } from "@pipedream/platform";
import common from "../common/rest-api.mjs";
import fs from "fs";

export default {
  ...common,
  key: "pcloud-get-zip",
  name: "Get Zip",
  description: "Receive a zip file from the user's filesystem. [See the docs here](https://docs.pcloud.com/methods/archiving/getzip.html)",
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
    outputFile: {
      type: "string",
      label: "Output Filename",
      description: "The filename of the output zip file that will be written to the `/tmp` folder, e.g. `/tmp/myFile.zip`",
    },
  },
  methods: {
    ...common.methods,
    async getZip({
      $, params,
    }) {
      return axios($, {
        url: `https://${this.pcloud.$auth.hostname}/getzip`,
        params: {
          ...params,
          auth: await this.getAuth($),
        },
        responseType: "arraybuffer",
      });
    },
  },
  async run({ $ }) {
    const response = await this.getZip({
      params: {
        folderids: this.folderIds?.length
          ? this.folderIds.join()
          : undefined,
        fileids: this.fileIds?.length
          ? this.fileIds.join()
          : undefined,
      },
      $,
    });

    const outputFilePath = this.outputFile.includes("tmp/")
      ? this.outputFile
      : `/tmp/${this.outputFile}`;

    fs.writeFileSync(outputFilePath, response);

    $.export("$summary", "Successfully created zip file.");

    return {
      outputFilePath,
      response,
    };
  },
};
