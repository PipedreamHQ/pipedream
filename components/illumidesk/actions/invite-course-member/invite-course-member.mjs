import illumidesk from "../../illumidesk.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "illumidesk-invite-course-member",
  name: "Invite Course Member",
  description: "Invites a user to a selected course. [See the documentation](https://developers.illumidesk.com/reference/courses_invitations_create)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    illumidesk,
    campusSlug: {
      propDefinition: [
        illumidesk,
        "campusSlug",
      ],
    },
    courseSlug: {
      propDefinition: [
        illumidesk,
        "courseSlug",
        (c) => ({
          campusSlug: c.campusSlug,
        }),
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the member to invite",
    },
    role: {
      type: "string",
      label: "Role",
      description: "Role of the member in the course",
      options: constants.ROLES,
    },
    permission: {
      type: "string",
      label: "Permission",
      description: "Permission of the member in the course. Required for Role `instructor`.",
      optional: true,
      options: constants.PERMISSIONS,
    },
  },
  async run({ $ }) {
    if (this.role === "instructor" && !this.permission) {
      throw new ConfigurationError("Permission is required for Role of `instructor`.");
    }
    const invitation = {
      email: this.email,
      role: this.role,
    };
    if (this.role === "instructor") {
      invitation.permission = this.permission;
    }
    const response = await this.illumidesk.inviteUserToCourse({
      courseSlug: this.courseSlug,
      data: {
        invitations: [
          invitation,
        ],
      },
      $,
    });
    $.export("$summary", `Successfully invited member ${this.email} to course ${this.courseSlug}.`);
    return response;
  },
};
