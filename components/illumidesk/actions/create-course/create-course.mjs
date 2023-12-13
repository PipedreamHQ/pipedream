import illumidesk from "../../illumidesk.app.mjs";

export default {
  key: "illumidesk-create-course",
  name: "Create Course",
  description: "Create a new course. The course title is required. Course description and duration are optional.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    illumidesk,
    courseTitle: {
      propDefinition: [
        illumidesk,
        "courseTitle",
      ],
      description: "The title of the new course to be created.",
    },
    courseDescription: {
      propDefinition: [
        illumidesk,
        "courseDescription",
      ],
      description: "The description of the new course to be created.",
      optional: true,
    },
    courseDuration: {
      propDefinition: [
        illumidesk,
        "courseDuration",
      ],
      description: "The duration of the new course to be created in minutes.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.illumidesk.createCourse({
      courseTitle: this.courseTitle,
      courseDescription: this.courseDescription,
      courseDuration: this.courseDuration,
    });
    $.export("$summary", `Successfully created course with ID: ${response.id}`);
    return response;
  },
};
