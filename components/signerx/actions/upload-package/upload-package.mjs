import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import signerx from "../../signerx.app.mjs";

export default {
  key: "signerx-upload-package",
  name: "Upload Package",
  description: "Quickly create a draft for a new package/document by uploading a file or providing a file_url to a PDF document. [See the documentation](https://documenter.getpostman.com/view/13877745/2sa3xv9kni)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    signerx,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`).",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the package/document",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = new FormData();

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
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
