import ezeepBlue from "../../ezeep_blue.app.mjs";
import { axios } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";

export default {
  key: "ezeep_blue-create-print-job",
  name: "Create Print Job",
  description: "Send a new print job to a specified printer.",
  version: "0.0.{{ts}}",
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
    },
    fileUrl: {
      propDefinition: [
        ezeepBlue,
        "fileUrl",
        (c) => ({
          printType: c.printType,
        }),
      ],
      optional: true,
    },
    file: {
      propDefinition: [
        ezeepBlue,
        "file",
        (c) => ({
          printType: c.printType,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      printerId, fileUrl, file, printType,
    } = this;

    let response;

    if (printType === "upload") {
      if (!file) {
        throw new Error("File path is required when print type is 'upload'");
      }

      // Prepare file upload
      const prepareResponse = await this.ezeepBlue._makeRequest({
        method: "POST",
        path: "/prepare-upload",
      });

      // Upload file
      const formData = new FormData();
      formData.append("file", fs.createReadStream(`/tmp/${file}`));
      const uploadResponse = await this.ezeepBlue._makeRequest({
        method: "POST",
        path: prepareResponse.data.uploadUrl,
        headers: formData.getHeaders(),
        data: formData,
      });

      // Print uploaded file
      response = await this.ezeepBlue._makeRequest({
        method: "POST",
        path: "/print",
        data: {
          printerId,
          fileId: uploadResponse.data.fileId,
        },
      });
    } else if (printType === "url") {
      if (!fileUrl) {
        throw new Error("File URL is required when print type is 'url'");
      }

      // Print file from URL
      response = await this.ezeepBlue._makeRequest({
        method: "POST",
        path: "/print",
        data: {
          printerId,
          fileUrl,
        },
      });
    } else {
      throw new Error("Invalid print type. Please select 'upload' or 'url'.");
    }

    $.export("$summary", `Print job sent to printer with ID: ${printerId}`);
    return response;
  },
};
