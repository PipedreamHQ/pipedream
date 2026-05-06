import { axios } from "@pipedream/platform";
import FormData from "form-data";
import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-upload-file",
  name: "Upload File",
  description:
    "Uploads a file to Lever's temporary storage and returns a URI for use with posting applications."
    + " Use this before applying a candidate to a posting when a file (resume, cover letter) needs to be attached."
    + " The file is available for 24 hours — pass the returned `uri` to the posting application request within that window."
    + " Only accepts multipart/form-data. Maximum file size is 30MB."
    + " Note: this endpoint stores files temporarily for posting applications, not for attaching files to existing opportunities."
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
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "Publicly accessible URL to the file to upload (e.g. a PDF from S3 or Google Drive). Maximum 30MB.",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "Name for the file (e.g. `jane_doe_resume.pdf`). Must include the file extension.",
    },
  },
  async run({ $ }) {
    const fileBuffer = await axios($, {
      url: this.fileUrl,
      responseType: "arraybuffer",
    });

    const form = new FormData();
    form.append("file", Buffer.from(fileBuffer), {
      filename: this.fileName,
    });

    const response = await axios($, {
      method: "POST",
      url: "https://api.lever.co/v1/uploads",
      headers: {
        Authorization: `Bearer ${this.app.$auth.oauth_access_token}`,
        ...form.getHeaders(),
      },
      data: form,
    });

    const result = response.data ?? response;
    $.export("$summary", `Uploaded "${result.filename ?? this.fileName}" — URI valid for 24 hours`);
    return result;
  },
};
