import FormData from "form-data";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import signerx from "../../signerx.app.mjs";

export default {
  key: "signerx-upload-package",
  name: "Upload Package",
  description: "Quickly create a draft for a new package/document by uploading a file or providing a file_url to a PDF document. [See the documentation](https://documenter.getpostman.com/view/13877745/2sa3xv9kni)",
  version: "0.0.1",
  type: "action",
  props: {
    signerx,
    documentType: {
      type: "string",
      label: "Document Type",
      description: "whether you hava the file or an URL to the file.",
      options: [
        "file",
        "file_url",
      ],
      reloadProps: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the package/document",
    },
  },
  async additionalProps() {
    const props = {};
    props.file = (this.documentType === "file")
      ? {
        type: "string",
        label: "File",
        description: "The path to the pdf file saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
      }
      : {
        type: "string",
        label: "File URL",
        description: "The URL to the file.",
      };
    return props;
  },
  async run({ $ }) {
    const data = new FormData();
    if (this.documentType === "file") {
      data.append("file", fs.createReadStream(checkTmp(this.file)));
    } else {
      data.append("file_url", this.file);
    }
    data.append("name", this.name);

    const response = await this.signerx.createDraftPackage({
      $,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", `Successfully created draft package with name "${this.name}"`);
    return response;
  },
};
