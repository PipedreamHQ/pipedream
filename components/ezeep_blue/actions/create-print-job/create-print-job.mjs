import FormData from "form-data";
import fs from "fs";
import {
  checkTmp, clearObj,
} from "../../common/utils.mjs";
import ezeepBlue from "../../ezeep_blue.app.mjs";

export default {
  key: "ezeep_blue-create-print-job",
  name: "Create Print Job",
  description: "Send a new print job to a specified printer.",
  version: "0.0.1",
  type: "action",
  props: {
    ezeepBlue,
    printerId: {
      propDefinition: [
        ezeepBlue,
        "printerId",
      ],
    },
    printType: {
      propDefinition: [
        ezeepBlue,
        "printType",
      ],
      reloadProps: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the file. (e.g. txt)",
    },
    alias: {
      type: "string",
      label: "Alias",
      description: "Original name of file/document. If it is empty, the fileid will be used.",
      optional: true,
    },
    printAndDelete: {
      type: "boolean",
      label: "Print And Delete",
      description: "If `true` the uploaded document will be deleted after printing. If `false` the uploaded document remains on the server. Default is `false`.",
      optional: true,
    },
    paperId: {
      propDefinition: [
        ezeepBlue,
        "paperId",
        ({ printerId }) => ({
          printerId,
        }),
      ],
      withLabel: true,
      optional: true,
    },
    color: {
      type: "boolean",
      label: "Color",
      description: "Enable color.",
      optional: true,
    },
    duplex: {
      type: "boolean",
      label: "Duplex",
      description: "Enable duplex",
      optional: true,
    },
    duplexMode: {
      type: "integer",
      label: "Duplex Mode",
      description: "Duplex mode.",
      optional: true,
    },
    orientation: {
      propDefinition: [
        ezeepBlue,
        "orientation",
        ({ printerId }) => ({
          printerId,
        }),
      ],
      optional: true,
    },
    copies: {
      type: "integer",
      label: "Copies",
      description: "Count of copies.",
      optional: true,
    },
    resolution: {
      propDefinition: [
        ezeepBlue,
        "resolution",
        ({ printerId }) => ({
          printerId,
        }),
      ],
      optional: true,
    },
  },
  async additionalProps() {
    switch (this.printType) {
    case "url" : return {
      fileUrl: {
        type: "string",
        label: "File URL",
        description: "The URL of the file to print",
      },
    };
    case "upload": return {
      file: {
        type: "string",
        label: "File Path",
        description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
      },
      paperLength: {
        type: "string",
        label: "Paper Length",
        description: "If paperid == 256 (custom size): length of paper in tenths of mm.",
        optional: true,
      },
      paperWidth: {
        type: "string",
        label: "Paper Width",
        description: "If paperid == 256 (custom size): width of paper in tenths of mm.",
        optional: true,
      },
    };
    }
  },
  async run({ $ }) {
    const {
      printerId,
      fileUrl,
      file,
      printType,
    } = this;

    let response;

    const data = {
      type: this.type,
      alias: this.alias,
      printerid: printerId,
      properties: {
        printanddelete: this.printAndDelete,
        paper: this.paperId && this.paperId.label,
        paperid: this.paperId && this.paperId.value,
        color: this.color,
        duplex: this.duplex,
        duplexmode: this.duplexMode,
        orientation: this.orientation,
        copies: this.copies,
        resolution: this.resolution,
      },
    };

    if (printType === "upload") {
      // Prepare file upload
      const {
        sasUri, fileid,
      } = await this.ezeepBlue.prepareFileUpload();

      // Upload file
      const formData = new FormData();
      formData.append("file", fs.createReadStream(checkTmp(file)));

      await this.ezeepBlue.uploadFile({
        url: sasUri,
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "x-ms-blob-content-type": "application/octet-stream",
          ...formData.getHeaders(),
        },
        transformRequest: [
          (data, headers) => {
            delete headers.common["Transfer-Encoding"];
            return JSON.stringify(data);
          },
        ],
        data: formData,
      });

      data.fileid = fileid;
      data.paperlength = this.paperLength;
      data.paperwidth = this.paperWidth;

    } else if (printType === "url") {
      data.fileurl = fileUrl;
    }

    // Print file from URL
    response = await this.ezeepBlue.printFile({
      data: clearObj(data),
    });

    $.export("$summary", `Print job sent to printer with ID: ${printerId}`);
    return response;
  },
};
