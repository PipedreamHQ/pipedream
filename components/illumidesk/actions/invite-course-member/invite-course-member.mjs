import illumidesk from "../../illumidesk.app.mjs";

export default {
  key: "illumidesk-invite-course-member",
  name: "Invite Course Member",
  description: "Invites a user to a selected course. [See the documentation](https://developers.illumidesk.com/reference)",
  version: "0.0.1",
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
      options: [
        "student",
        "instructor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.illumidesk.inviteUserToCourse({
      courseSlug: this.courseSlug,
      data: {
        invitations: [
          {
            email: this.email,
            role: this.role,
          },
        ],
      },
      $,
    });
    $.export("$summary", `Successfully invited member ${this.memberEmail} to course ${this.courseSlug}.`);
    return response;
  },
};
