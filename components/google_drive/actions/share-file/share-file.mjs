import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-share-file",
  name: "Share File",
  description:
    "Share a file or folder in Google Drive by creating a sharing permission."
    + " Supports sharing with a specific user, a group, an entire domain, or anyone with the link."
    + " Use **Search Files** first to find the file ID by name."
    + "\n\n**Sharing types:**"
    + "\n- `user` — share with a specific person (requires `emailAddress`)"
    + "\n- `group` — share with a Google Group (requires `emailAddress`)"
    + "\n- `domain` — share with everyone in a Google Workspace domain (requires `domain`)"
    + "\n- `anyone` — share with anyone who has the link (no email/domain needed)"
    + "\n\n**Roles:** `reader` (view only), `commenter` (can comment), `writer` (can edit)."
    + " Use **List Permissions** to see existing sharing on a file."
    + " [See the documentation](https://developers.google.com/drive/api/v3/reference/permissions/create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleDrive,
    fileId: {
      type: "string",
      label: "File ID",
      description:
        "The ID of the file or folder to share."
        + " Use **Search Files** to find the file ID by name.",
    },
    type: {
      type: "string",
      label: "Type",
      description:
        "The type of grantee: `user`, `group`, `domain`, or `anyone`.",
      options: [
        "user",
        "group",
        "domain",
        "anyone",
      ],
    },
    role: {
      type: "string",
      label: "Role",
      description:
        "The access level to grant: `reader` (view), `commenter` (comment), or `writer` (edit).",
      options: [
        "reader",
        "commenter",
        "writer",
      ],
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description:
        "The email address of the user or group to share with."
        + " Required when type is `user` or `group`. Ignored for `domain` and `anyone`.",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description:
        "The Google Workspace domain to share with (e.g., `example.com`)."
        + " Required when type is `domain`. Ignored for other types.",
      optional: true,
    },
  },
  async run({ $ }) {
    const resp = await this.googleDrive.createPermission(this.fileId, {
      role: this.role,
      type: this.type,
      emailAddress: this.emailAddress,
      domain: this.domain,
    });

    const target = this.emailAddress || this.domain || this.type;
    $.export("$summary", `Shared file with ${target} as ${this.role}`);
    return resp;
  },
};
