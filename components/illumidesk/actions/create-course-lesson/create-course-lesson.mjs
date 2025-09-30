import illumidesk from "../../illumidesk.app.mjs";

export default {
  key: "illumidesk-create-course-lesson",
  name: "Create Course Lesson",
  description: "Create a new lesson in a course. [See the documentation](https://developers.illumidesk.com/reference/courses_lessons_create)",
  version: "0.0.2",
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
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new lesson",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the new lesson",
      optional: true,
    },
    order: {
      type: "integer",
      label: "Order",
      description: "An integer representing the order of the lesson (0 respresents the first position in the list)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.illumidesk.createLesson({
      $,
      courseSlug: this.courseSlug,
      data: {
        title: this.title,
        description: this.description,
        order: this.order,
      },
    });
    $.export("$summary", `Successfully created lesson with ID: ${response.uuid}`);
    return response;
  },
};
