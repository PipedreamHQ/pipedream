import edusign from "../../edusign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "edusign-get-course",
  name: "Get Course Details",
  description: "Retrieves details about a specific course using the course ID. [See the documentation](https://ext.edusign.fr/doc/)",
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
  },
  async run({ $ }) {
    const response = await this.edusign.getCourseDetails({
      courseId: this.courseId,
    });
    $.export("$summary", `Retrieved course details for course ID ${this.courseId}`);
    return response;
  },
};
