import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-get-user-details",
  name: "Get User Details",
  description:
    "Retrieve the authenticated user's Google Drive identity and storage quota."
    + " Returns display name, email address, permission ID, and storage usage/limits."
    + " Use this tool when the user asks 'who am I?' or needs their identity for owner-based queries."
    + " When the user says 'my files' or 'my documents', call this first to get the owner email,"
    + " then pass it to **Search Files** with a query like `'user@example.com' in owners`."
    + " [See the documentation](https://developers.google.com/drive/api/v3/reference/about/get)",
  version: "0.0.1",
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
    const about = await this.googleDrive.getAbout("user,storageQuota");

    const name =
      about?.user?.displayName
      || about?.user?.emailAddress
      || about?.user?.permissionId;
    $.export("$summary", `Retrieved Google Drive user: ${name}`);

    return about;
  },
};
