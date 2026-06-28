import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import app from "../../lever.app.mjs";

export default {
  key: "lever-upload-file",
  name: "Upload File",
  description:
    "Uploads a file to Lever's temporary storage and returns a URI for use with posting applications."
    + " Use this before applying a candidate to a posting when a file (resume, cover letter) needs to be attached."
    + " The file is available for 24 hours — pass the returned `uri` to the posting application request within that window."
    + " Only accepts multipart/form-data. Maximum file size is 30MB."
    + " Note: this endpoint stores files temporarily for posting applications, not for attaching files to existing opportunities."
    + " Example: call with file=\"/tmp/resume.pdf\" → returns a response containing a `uri` valid for 24h; pass that uri to a posting application."
    + " [See the documentation](https://hire.lever.co/developer/documentation#upload-a-file)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide a file path from the `/tmp` directory (e.g. `/tmp/jane_doe_resume.pdf`) or a public URL. Maximum 30MB.",
      format: "file-ref",
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
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);

    const form = new FormData();
    form.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.app.uploadFile({
      $,
      headers: form.getHeaders(),
      data: form,
    });

    const result = response.data ?? response;
    $.export("$summary", `Uploaded "${metadata.name}" — URI valid for 24 hours`);
    return result;
  },
};
