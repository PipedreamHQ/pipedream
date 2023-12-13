import illumidesk from "../../illumidesk.app.mjs";

export default {
  key: "illumidesk-list-courses",
  name: "List Courses",
  description: "List all the courses associated with a given campus",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    illumidesk,
    campusId: {
      propDefinition: [
        illumidesk,
        "campusId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.illumidesk.listCoursesByCampus({
      campusId: this.campusId,
    });
    $.export("$summary", `Successfully listed ${response.length} courses`);
    return response;
  },
};
