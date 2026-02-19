import updatedFileInstant from "../../../sharepoint/sources/updated-file-instant/updated-file-instant.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...updatedFileInstant,
  ...utils.getAppProps(updatedFileInstant),
  key: "sharepoint_admin-updated-file-instant",
  name: updatedFileInstant.name,
  description: updatedFileInstant.description,
  type: updatedFileInstant.type,
  version: "0.0.1",
  methods: {
    ...updatedFileInstant.methods,
  },
  hooks: {
    ...updatedFileInstant.hooks,
  },
  async run(event) {
    // Create compatibility layer: map this.sharepoint to this.sharepointAdmin
    this.sharepoint = this.sharepointAdmin;
    return updatedFileInstant.run.call(this, event);
  },
};
