import updatedFileInstant from "../../../sharepoint/sources/updated-file-instant/updated-file-instant.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...updatedFileInstant,
  ...utils.getAppProps(updatedFileInstant),
  key: "sharepoint_admin-updated-file-instant",
  name: updatedFileInstant.name,
  description: updatedFileInstant.description,
  type: updatedFileInstant.type,
  version: "0.0.2",
  methods: {
    ...updatedFileInstant.methods,
  },
  hooks: {
    async activate() {
      this.sharepoint = this.sharepointAdmin;
      return updatedFileInstant.hooks.activate.call(this);
    },
    async deactivate() {
      this.sharepoint = this.sharepointAdmin;
      return updatedFileInstant.hooks.deactivate.call(this);
    },
  },
  async run(event) {
    // Create compatibility layer: map this.sharepoint to this.sharepointAdmin
    this.sharepoint = this.sharepointAdmin;
    return updatedFileInstant.run.call(this, event);
  },
};
