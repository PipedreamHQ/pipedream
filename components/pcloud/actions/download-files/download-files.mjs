import common from "../common/base.mjs";
import { propFolderId } from "../../props-custom-descriptions.mjs";

export default {
  ...common,
  key: "pcloud-download-files",
  name: "Download File(s)",
  description: "Download one or more files to a folder. [See the docs here](https://docs.pcloud.com/methods/file/downloadfile.html)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    urls: {
      type: "string[]",
      label: "URLs",
      description: "URL(s) of the files to download.",
    },
    folderId: propFolderId(" to receive the downloaded files"),
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
