import pipedream_utils from "../../pipedream_utils.app.mjs";
import { nanoid } from "nanoid";

export default {
  key: "pipedream_utils-get-temporary-file-url",
  name: "Helper Functions - Get Temporary File Upload or Download URL",
  description: "Generates a presigned URL to upload or download a file from File Stash. Currently available in Pipedream Connect. [See the documentation](https://pipedream.com/docs/connect/components/files)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedream_utils,
    path: {
      type: "string",
      label: "Path",
      description: "The path (including filename) where the file is stored. If not provided, a random filename will be generated.",
      optional: true,
    },
    getUploadUrl: {
      type: "boolean",
      label: "Get Upload URL",
      description: "Defaults to `true`. Pass `false` to skip generating an upload URL.",
      default: true,
      optional: true,
    },
    getDownloadUrl: {
      type: "boolean",
      label: "Get Download URL",
      description: "Defaults to `true`. Pass `false` to skip generating a download URL.",
      default: true,
      optional: true,
    },
    dir: {
      type: "dir",
      accessMode: "read-write",
    },
  },
  async run({ $ }) {
    const filePath = this.path || nanoid();
    const file = await this.dir.open(filePath);

    const urls = {};
    if (this.getDownloadUrl) {
      urls.get_url = await file.toUrl();
    }
    if (this.getUploadUrl) {
      // Note: _put_url is an internal method and subject to change.
      urls.put_url = await file._put_url();
    }

    if (!Object.keys(urls).length) {
      $.export("$summary", "No URLs were requested");
    } else {
      $.export("$summary", `Successfully generated temporary file ${[
        urls.get_url && "download",
        urls.put_url && "upload",
      ].filter(Boolean).join(" and ")} URL${Object.keys(urls).length === 1
        ? ""
        : "s"}`);
    }

    return Object.assign({}, file.toJSON(), urls);
  },
};
