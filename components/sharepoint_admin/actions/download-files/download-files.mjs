import downloadFiles from "../../../sharepoint/actions/download-files/download-files.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...downloadFiles,
  ...utils.getAppProps(downloadFiles),
  key: "sharepoint_admin-download-files",
  name: downloadFiles.name,
  description: downloadFiles.description,
  type: downloadFiles.type,
  version: "0.0.1",
  methods: {
    ...downloadFiles.methods,
  },
  async run(opts) {
    // Create compatibility layer: map this.sharepoint to this.sharepointAdmin
    this.sharepoint = this.sharepointAdmin;
    return downloadFiles.run.call(this, opts);
  },
};
