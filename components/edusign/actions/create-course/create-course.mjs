import edusign from "../../edusign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "edusign-create-course",
  name: "Create Course",
  description: "Creates a new course in Edusign. [See the documentation](https://ext.edusign.fr/doc/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    edusign,
    courseId: {
      propDefinition: [
        edusign,
        "courseId",
      ],
    },
    courseName: {
      propDefinition: [
        edusign,
        "courseName",
      ],
    },
    courseDescription: {
      propDefinition: [
        edusign,
        "courseDescription",
      ],
      optional: true,
    },
    startDate: {
      propDefinition: [
        edusign,
        "startDate",
      ],
      optional: true,
    },
    endDate: {
      propDefinition: [
        edusign,
        "endDate",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.edusign.createCourse({
      courseId: this.courseId,
      courseName: this.courseName,
      courseDescription: this.courseDescription,
      startDate: this.startDate,
      endDate: this.endDate,
    });

    $.export("$summary", `Successfully created course with name: ${this.courseName}`);
    return response;
  },
};
