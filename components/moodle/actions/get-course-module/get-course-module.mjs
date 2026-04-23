import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-get-course-module",
  name: "Get a Course Module",
  description: "Retrieves detailed information about a specific course module using its CMID. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    moodle,
    courseId: {
      propDefinition: [
        moodle,
        "courseId",
      ],
    },
    sectionId: {
      propDefinition: [
        moodle,
        "sectionId",
        ({ courseId }) => ({
          courseId,
        }),
      ],
    },
    cmid: {
      propDefinition: [
        moodle,
        "moduleId",
        ({
          courseId, sectionId,
        }) => ({
          courseId,
          sectionId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.moodle.getCourseModule({
      $,
      params: {
        cmid: this.cmid,
      },
    });
    $.export("$summary", `Successfully retrieved course module with CMID ${this.cmid}`);
    return response;
  },
};
