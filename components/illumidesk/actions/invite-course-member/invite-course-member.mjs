import illumidesk from "../../illumidesk.app.mjs";

export default {
  key: "illumidesk-invite-course-member",
  name: "Invite Course Member",
  description: "Invites a user to a selected course. [See the documentation](https://developers.illumidesk.com/reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    illumidesk,
    courseId: {
      propDefinition: [
        illumidesk,
        "courseId",
      ],
    },
    memberEmail: {
      propDefinition: [
        illumidesk,
        "memberEmail",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.illumidesk.inviteUserToCourse({
      courseId: this.courseId,
      memberEmail: this.memberEmail,
    });
    $.export("$summary", `Successfully invited member ${this.memberEmail} to course ${this.courseId}`);
    return response;
  },
};
