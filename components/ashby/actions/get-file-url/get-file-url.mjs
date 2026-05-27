import app from "../../ashby.app.mjs";

export default {
  key: "ashby-get-file-url",
  name: "Get File URL",
  description: "Retrieves the URL of a file associated with a candidate. [See the documentation](https://developers.ashbyhq.com/reference/fileinfo)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    fileHandle: {
      type: "string",
      label: "File Handle",
      description: "A file handle string (can be retrieved by calling **Get Candidate** to get a candidate's `resumeFileHandle` or `fileHandles`).",
    },
  },
  async run({ $ }) {
    const {
      app,
      fileHandle,
    } = this;

    const response = await app.getFileUrl({
      $,
      data: {
        fileHandle,
      },
    });

    $.export("$summary", "Successfully retrieved file URL");

    return response;
  },
};
