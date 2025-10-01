import app from "../../attractwell.app.mjs";

export default {
  key: "attractwell-lesson-approval",
  name: "Lesson Approval",
  description: "Approves, rejects, or unapproves a lesson in the AttractWell system based on the selected status.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    approvalStatus: {
      type: "string",
      label: "Approval Status",
      description: "The approval status to set for the lesson.",
      options: [
        "approved",
        "rejected",
        "unapproved",
      ],
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email address of the contact.",
    },
    vaultId: {
      optional: false,
      propDefinition: [
        app,
        "vaultId",
      ],
    },
    onlineClassLessonId: {
      label: "Online Class Lesson ID",
      description: "The ID of the online class lesson.",
      optional: false,
      propDefinition: [
        app,
        "lessonId",
      ],
    },
    instructorComment: {
      type: "string",
      label: "Instructor Comment",
      description: "The comment from the instructor.",
      optional: true,
    },
  },
  methods: {
    lessonApproval(args = {}) {
      return this.app.post({
        path: "/classes/lessons/approve",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      lessonApproval,
      approvalStatus,
      contactEmail,
      vaultId,
      onlineClassLessonId,
      instructorComment,
    } = this;

    const response = await lessonApproval({
      $,
      data: {
        approval_status: approvalStatus,
        contact_email: contactEmail,
        vault_id: vaultId,
        online_class_lesson_id: onlineClassLessonId,
        instructor_comment: instructorComment,
      },
    });

    $.export("$summary", "Successfully updated lesson approval status.");
    return response;
  },
};
