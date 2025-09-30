import pcloud from "../../pcloud.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pcloud-download-files",
  name: "Download File(s)",
  description: "Download one or more files to a folder. [See the docs here](https://docs.pcloud.com/methods/file/downloadfile.html)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    urls: {
      type: "string[]",
      label: "URLs",
      description: "URL(s) of the files to download.",
    },
    folderId: {
      propDefinition: [
        pcloud,
        "folderId",
      ],
      description: `Select a **Folder** to receive the downloaded files.
        \\
        Alternatively, you can provide a custom *Folder ID*.`,
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return `Downloaded ${this.urls.length} files successfully`;
    },
    async requestMethod() {
      return this.pcloud.downloadFiles(this.urls, this.folderId);
    },
  },
};
