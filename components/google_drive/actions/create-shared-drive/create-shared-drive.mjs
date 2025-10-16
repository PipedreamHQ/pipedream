import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-create-shared-drive",
  name: "Create Shared Drive",
  description: "Create a new shared drive. [See the documentation](https://developers.google.com/drive/api/v3/reference/drives/create) for more information",
  version: "0.1.15",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDrive,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new shared drive",
    },
  },
  async run({ $ }) {
    const resp = await this.googleDrive.createDrive({
      name: this.name,
    });
    $.export("$summary", `Successfully created a new shared drive, "${resp.name}"`);
    return resp;
  },
};
