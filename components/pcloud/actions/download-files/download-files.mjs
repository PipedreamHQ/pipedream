import common from "../common/base.mjs";
import { folderId } from "../../props.mjs";

export default {
  ...common,
  key: "pcloud-download-files",
  name: "Download File(s)",
  description: "Download one or more files to a folder.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    urls: {
      type: "string[]",
      label: "URLs",
      description: "URL(s) of the files to download.",
    },
    folderId,
  },
  async run({ $ }) {
    const response = await this.pcloud._withRetries(() =>
      this.pcloud.downloadFiles(this.urls, this.folderId));

    $.export("$summary", `Downloaded ${this.urls.length} files successfully`);

    return response;
  },
};
