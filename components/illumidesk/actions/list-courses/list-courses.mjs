import illumidesk from "../../illumidesk.app.mjs";

export default {
  key: "illumidesk-list-courses",
  name: "List Courses",
  description: "List all the courses associated with a given campus. [See the documentation](https://developers.illumidesk.com/reference/campuses_public_campuses_courses_list)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const { results } = await this.illumidesk.listCoursesByCampus({
      campusSlug: this.campusSlug,
      $,
    });
    if (results?.length) {
      $.export("$summary", `Successfully listed ${results.length} course${results.length === 1
        ? ""
        : "s"}.`);
    }
    return results;
  },
};
