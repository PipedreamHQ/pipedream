import googleDirectory from "../../google_directory.app.mjs";

export default {
  key: "google_directory-add-member-to-group",
  name: "Add Member to Group",
  description: "Adds a member to a group. [See the documentation](https://developers.google.com/workspace/admin/directory/v1/guides/manage-group-members#create_member)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleDirectory,
    groupId: {
      propDefinition: [
        googleDirectory,
        "group",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the member to add",
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role of the member to add",
      options: [
        "MEMBER",
        "OWNER",
        "MANAGER",
      ],
      default: "MEMBER",
    },
  },
  async run({ $ }) {
    const response = await this.googleDirectory.addMemberToGroup({
      $,
      groupId: this.groupId,
      data: {
        email: this.email,
        role: this.role,
      },
    });

    $.export("$summary", `Successfully added member ${this.email} to group ${this.groupId}.`);

    return response;
  },
};
