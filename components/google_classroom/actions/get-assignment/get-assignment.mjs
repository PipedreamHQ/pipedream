import googleClassroom from "../../google_classroom.app.mjs";

export default {
  key: "google_classroom-get-assignment",
  name: "Get Assignment",
  description: "Retrieve information about an assignment. [See the docs here](https://developers.google.com/classroom/reference/rest/v1/courses.courseWork/get)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleClassroom,
    courseStates: {
      propDefinition: [
        googleClassroom,
        "courseStates",
      ],
    },
    course: {
      propDefinition: [
        googleClassroom,
        "course",
        (c) => ({
          courseStates: c.courseStates,
        }),
      ],
    },
    assignmentStates: {
      propDefinition: [
        googleClassroom,
        "courseworkStates",
      ],
    },
    assignment: {
      propDefinition: [
        googleClassroom,
        "coursework",
        (c) => ({
          courseId: c.course,
          courseWorkStates: c.assignmentStates,
        }),
      ],
    },
  },
  async run({ $ }) {
    const params = {
      courseId: this.course,
      id: this.assignment,
    };
    const assignment = await this.googleClassroom.getCoursework(params);
    $.export("$summary", `Successfully retrieved assignment with ID ${assignment.id}`);
    return assignment;
  },
};
