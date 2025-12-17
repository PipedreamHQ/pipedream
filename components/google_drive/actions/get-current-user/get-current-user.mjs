import googleDrive from "../../google_drive.app.mjs";

const ABOUT_FIELDS = "user,storageQuota";

export default {
  key: "google_drive-get-current-user",
  name: "Get Current User",
  description: "Retrieve Google Drive account metadata for the authenticated user via `about.get`, including display name, email, permission ID, and storage quota. Useful when flows or agents need to confirm the active Google identity or understand available storage. [See the documentation](https://developers.google.com/drive/api/v3/reference/about/get).",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    googleDrive,
  },
  async run({ $ }) {
    const about = await this.googleDrive.getAbout(ABOUT_FIELDS);

    const summaryName =
      about?.user?.displayName
      || about?.user?.emailAddress
      || about?.user?.permissionId;
    $.export("$summary", `Retrieved Google Drive user ${summaryName}`);

    return {
      about,
    };
  },
};
