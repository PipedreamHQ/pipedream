const googleDrive = require("../../google_drive.app");

module.exports = {
  key: "google_drive-create-shared-drive",
  name: "Create Shared Drive",
  description: "Create Shared Drive",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    /* eslint-disable pipedream/default-value-required-for-optional-props */
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new shared drive",
      optional: true,
    },
  },
  async run() {
    return await this.googleDrive.createDrive({
      name: this.name,
    });
  },
};
