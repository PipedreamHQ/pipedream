import googleClassroom from "../../google_classroom.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_classroom-list-assignments",
  name: "List Assignments",
  description: "Retrieve a list of assignments for a course. [See the documentation](https://developers.google.com/classroom/reference/rest/v1/courses.courseWork/list)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleClassroom,
    course: {
      propDefinition: [
        googleClassroom,
        "course",
        (c) => ({
          courseStates: c.courseStates,
        }),
      ],
    },
    assignmentType: {
      type: "string",
      label: "Assignment Type",
      description: "Get only past due assignments, not yet due assignments, or all assignments",
      options: [
        "past due",
        "not yet due",
        "all",
      ],
      default: "all",
      optional: true,
    },
  },
  methods: {
    getDueTs(dueDate, dueTime) {
      const {
        year, month, day,
      } = dueDate;
      let dateString = `${year}-${utils.padZero(month)}-${utils.padZero(day)}`;
      if (dueTime) {
        const {
          hours, minutes,
        } = dueTime;
        dateString += `T${utils.padZero(hours)}:${minutes
          ? utils.padZero(minutes)
          : "00"}:00`;
      }
      return Date.parse(dateString);
    },
    isRelevant(assignment) {
      if (!this.assignmentType || this.assignmentType === "all") {
        return true;
      }
      if (!assignment.dueDate) {
        return false;
      }

      const dueDate = this.getDueTs(assignment.dueDate, assignment.dueTime);

      if (this.assignmentType === "past due") {
        return dueDate < Date.now();
      }
      if (this.assignmentType === "not yet due") {
        return dueDate > Date.now();
      }
    },
  },
  async run({ $ }) {
    const params = {
      courseId: this.course,
    };

    const assignments = [];

    do {
      const {
        courseWork, nextPageToken,
      } = await this.googleClassroom.listCoursework(params);
      if (!courseWork?.length) {
        break;
      }
      for (const assignment of courseWork) {
        if (this.isRelevant(assignment)) {
          assignments.push(assignment);
        }
      }
      params.pageToken = nextPageToken;
    } while (params.pageToken);

    $.export("$summary", `Successfully retrieved ${assignments.length} assignment${assignments.length === 1
      ? ""
      : "s"}.`);

    return assignments;
  },
};
