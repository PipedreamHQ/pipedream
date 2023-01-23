import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-get-shared-drive",
  name: "Get Shared Drive",
  description: "Get a shared drive's metadata by ID. [See the docs](https://developers.google.com/drive/api/v3/reference/drives/get) for more information",
  version: "0.0.4",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description:
        "Select a [shared drive](https://support.google.com/a/users/answer/9310351).",
      default: "",
    },
    useDomainAdminAccess: {
      propDefinition: [
        googleDrive,
        "useDomainAdminAccess",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.googleDrive.getSharedDrive(
      this.googleDrive.getDriveId(this.drive),
      {
        useDomainAdminAccess: this.useDomainAdminAccess,
      },
    );
    $.export("$summary", `Successfully fetched the shared drive, "${resp.name}"`);
    return resp;
  },
};
