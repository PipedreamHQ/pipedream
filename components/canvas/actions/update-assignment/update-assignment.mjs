import canvas from "../../canvas.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  key: "canvas-update-assignment",
  name: "Update Assignment",
  description: "Update an assignment. [See the documentation](https://mitt.uib.no/doc/api/all_resources.html#method.assignments_api.update)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    canvas,
    accountId: {
      propDefinition: [
        canvas,
        "accountId",
      ],
    },
    userId: {
      propDefinition: [
        canvas,
        "userId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    courseId: {
      propDefinition: [
        canvas,
        "courseId",
        (c) => ({
          userId: c.userId,
        }),
      ],
    },
    assignmentId: {
      propDefinition: [
        canvas,
        "assignmentId",
        (c) => ({
          courseId: c.courseId,
          userId: c.userId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the assignment",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the assignment, supports HTML",
      optional: true,
    },
    submissionType: {
      type: "string",
      label: "Submission Type",
      description: "The type of submission for the assignment",
      options: constants.SUBMISSION_TYPES,
      optional: true,
    },
    notifyOfUpdate: {
      type: "boolean",
      label: "Notify of Update",
      description: "Whether to notify the students of the update",
      optional: true,
    },
    pointsPossible: {
      type: "integer",
      label: "Points Possible",
      description: "The maximum points possible on the assignment",
      optional: true,
    },
    gradingType: {
      type: "string",
      label: "Grading Type",
      description: "The strategy used for grading the assignment. The assignment defaults to “points” if this field is omitted.",
      options: constants.GRADING_TYPES,
      optional: true,
    },
    dueAt: {
      type: "string",
      label: "Due At",
      description: "The day/time the assignment is due. Accepts times in ISO 8601 format, e.g. 2014-10-21T18:48:00Z.",
      optional: true,
    },
    omitFromFinalGrade: {
      type: "boolean",
      label: "Omit From Final Grade",
      description: "Whether this assignment is counted towards a student's final grade.",
      optional: true,
    },
    allowedAttempts: {
      type: "integer",
      label: "Allowed Attempts",
      description: "The number of submission attempts allowed for this assignment. Set to -1 for unlimited attempts.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (
      !this.name
      && !this.description
      && !this.submissionType
      && !this.notifyOfUpdate
      && !this.pointsPossible
      && !this.gradingType
      && !this.dueAt
      && !this.omitFromFinalGrade
      && !this.allowedAttempts
    ) {
      throw new ConfigurationError("At least one field must be provided to update the assignment");
    }

    const assignment = await this.canvas.updateAssignment({
      $,
      courseId: this.courseId,
      assignmentId: this.assignmentId,
      data: {
        assignment: {
          name: this.name,
          description: this.description,
          submission_types: this.submissionType
            ? [
              this.submissionType,
            ]
            : undefined,
          notify_of_update: this.notifyOfUpdate,
          points_possible: this.pointsPossible,
          grading_type: this.gradingType,
          due_at: this.dueAt,
          omit_from_final_grade: this.omitFromFinalGrade,
          allowed_attempts: this.allowedAttempts,
        },
      },
    });
    $.export("$summary", `Successfully updated assignment with ID: '${this.assignmentId}'`);
    return assignment;
  },
};
