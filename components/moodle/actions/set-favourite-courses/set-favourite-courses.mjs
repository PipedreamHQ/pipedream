import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-set-favourite-courses",
  name: "Set Favourite Courses",
  description: "Adds or removes a course from the user's list of favourite courses. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    moodle,
    courseId: {
      propDefinition: [
        moodle,
        "courseId",
      ],
    },
    favourite: {
      type: "boolean",
      label: "Favourite",
      description: "Set to `true` to add the course to favourites, or `false` to remove it",
    },
  },
  async run({ $ }) {
    const response = await this.moodle.setFavouriteCourses({
      $,
      params: {
        "courses[0][id]": this.courseId,
        "courses[0][favourite]": this.favourite
          ? 1
          : 0,
      },
    });
    const action = this.favourite
      ? "added to"
      : "removed from";
    $.export("$summary", `Successfully ${action} favourites for course ${this.courseId}`);
    return response;
  },
};
