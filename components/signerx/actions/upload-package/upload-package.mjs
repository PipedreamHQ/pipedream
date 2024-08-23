import signerx from "../../signerx.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "signerx-upload-package",
  name: "Upload Package",
  description: "Quickly create a draft for a new package/document by uploading a file or providing a file_url to a PDF document. [See the documentation](https://documenter.getpostman.com/view/13877745/2sa3xv9kni)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    signerx,
    file: {
      propDefinition: [
        signerx,
        "file",
      ],
    },
    name: {
      propDefinition: [
        signerx,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.signerx.createDraftPackage({
      file: this.file,
      name: this.name,
    });

    $.export("$summary", `Successfully created draft package with name "${this.name}"`);
    return response;
  },
};
