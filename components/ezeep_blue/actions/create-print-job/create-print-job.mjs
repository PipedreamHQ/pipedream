import FormData from "form-data";
import { clearObj } from "../../common/utils.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import ezeepBlue from "../../ezeep_blue.app.mjs";

export default {
  key: "ezeep_blue-create-print-job",
  name: "Create Print Job",
  description: "Send a new print job to a specified printer.",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ezeepBlue,
    printerId: {
      propDefinition: [
        ezeepBlue,
        "printerId",
      ],
    },
    file: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory.",
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      ezeepBlue,
      printerId,
      file,
      paperLength,
      paperWidth,
    } = this;

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
      paperlength: paperLength,
      paperwidth: paperWidth,
    };

    const {
      sasUri, fileid,
    } = await ezeepBlue.prepareFileUpload();

    const { stream } = await getFileStreamAndMetadata(file);
    const formData = new FormData();
    formData.append("file", stream);

    await ezeepBlue.uploadFile({
      url: sasUri,
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "x-ms-blob-content-type": "application/octet-stream",
        ...formData.getHeaders(),
      },
      transformRequest: [
        (reqData, headers) => {
          delete headers.common["Transfer-Encoding"];
          return JSON.stringify(reqData);
        },
      ],
      data: formData,
    });

    data.fileid = fileid;

    const response = await ezeepBlue.printFile({
      data: clearObj(data),
    });

    $.export("$summary", `Print job sent to printer with ID: ${printerId}`);
    return response;
  },
};
