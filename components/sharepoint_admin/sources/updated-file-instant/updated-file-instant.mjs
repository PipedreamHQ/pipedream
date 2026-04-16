import updatedFileInstant from
  "../../../sharepoint/sources/updated-file-instant/updated-file-instant.mjs";
import utils from "../../common/utils.mjs";
import { extractCustomFields } from
  "../../common/customFields.mjs";

export default {
  ...updatedFileInstant,
  ...utils.getAppProps(updatedFileInstant),
  key: "sharepoint_admin-updated-file-instant",
  name: updatedFileInstant.name,
  description: updatedFileInstant.description,
  type: updatedFileInstant.type,
  version: "0.0.4",
  methods: {
    ...updatedFileInstant.methods,
    async buildEmitPayload(file, freshFile) {
      const payload =
        await updatedFileInstant.methods
          .buildEmitPayload.call(this, file, freshFile);
      payload.customFields = extractCustomFields(
        payload.listItemFields,
      );
      return payload;
    },
  },
  hooks: {
    async activate() {
      this.sharepoint = this.sharepointAdmin;
      return updatedFileInstant.hooks.activate.call(this);
    },
    async deactivate() {
      this.sharepoint = this.sharepointAdmin;
      return updatedFileInstant.hooks.deactivate
        .call(this);
    },
  },
  async run(event) {
    this.sharepoint = this.sharepointAdmin;
    return updatedFileInstant.run.call(this, event);
  },
};
