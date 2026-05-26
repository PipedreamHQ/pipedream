import { ConfigurationError } from "@pipedream/platform";
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
      type: "object",
      label: "File Handle",
      description: "A file handle object (can be retrieved by calling **Get Candidate** to get a candidate's `resumeFileHandle` or `fileHandles`). A JSON-serialized string is also accepted and will be parsed automatically.",
    },
  },
  async run({ $ }) {
    const {
      app,
      fileHandle,
    } = this;

    let parsedFileHandle = fileHandle;
    if (typeof fileHandle === "string") {
      try {
        parsedFileHandle = JSON.parse(fileHandle);
      } catch {
        throw new ConfigurationError("`File Handle` must be a valid object or a JSON-serialized string.");
      }
    }

    const response = await app.getFileUrl({
      $,
      data: {
        fileHandle: parsedFileHandle,
      },
    });

    $.export("$summary", "Successfully retrieved file URL");

    return response;
  },
};
