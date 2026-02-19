import retrieveFileMetadata from "../../../sharepoint/actions/retrieve-file-metadata/retrieve-file-metadata.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...retrieveFileMetadata,
  ...utils.getAppProps(retrieveFileMetadata),
  key: "sharepoint_admin-retrieve-file-metadata",
  name: retrieveFileMetadata.name,
  description: retrieveFileMetadata.description,
  type: retrieveFileMetadata.type,
  version: "0.0.1",
  methods: {
    ...retrieveFileMetadata.methods,
  },
  async run(opts) {
    // Create compatibility layer: map this.sharepoint to this.sharepointAdmin
    this.sharepoint = this.sharepointAdmin;
    return retrieveFileMetadata.run.call(this, opts);
  },
};
