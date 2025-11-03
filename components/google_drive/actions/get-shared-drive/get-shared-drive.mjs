import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-get-shared-drive",
  name: "Get Shared Drive",
  description: "Get metadata for one or all shared drives. [See the documentation](https://developers.google.com/drive/api/v3/reference/drives/get) for more information",
  version: "0.1.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "sharedDrive",
      ],
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
      this.drive ?? null,
      {
        useDomainAdminAccess: this.useDomainAdminAccess,
      },
    );
    const summary = resp.drives
      ? `${resp.drives.length} shared drives`
      : `the shared drive "${resp.name}"`;
    $.export("$summary", `Successfully fetched ${summary}`);
    return resp;
  },
};
