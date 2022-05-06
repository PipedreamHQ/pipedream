import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-create-folder",
  name: "Create Folder",
  description: "Create a new empty folder. [See the docs](https://developers.google.com/drive/api/v3/reference/files/create) for more information",
  version: "0.0.4",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      optional: true,
    },
    parentId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description:
        "Select a folder in which to place the new folder. If not specified, the folder will be placed directly in the drive's top-level folder.",
      optional: true,
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      label: "Name",
      description: "The name of the new folder",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      parentId,
      name,
    } = this;
    const driveId = this.googleDrive.getDriveId(this.drive);
    const resp = await this.googleDrive.createFolder({
      name,
      parentId,
      driveId,
    });
    $.export("$summary", `Successfully created a new folder, "${resp.name}"`);
    return resp;
  },
};
