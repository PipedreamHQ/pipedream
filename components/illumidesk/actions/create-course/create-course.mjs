import illumidesk from "../../illumidesk.app.mjs";

export default {
  key: "illumidesk-create-course",
  name: "Create Course",
  description: "Create a new course. [See the documentation](https://developers.illumidesk.com/reference/campuses_courses_create)",
  version: "0.0.3",
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
    title: {
      type: "string",
      label: "Course Title",
      description: "The title of the course",
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "The slug for the course",
      optional: true,
    },
    shortIntro: {
      type: "string",
      label: "Short Intro",
      description: "A short intro of the course",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the course",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.illumidesk.createCourse({
      campusSlug: this.campusSlug,
      data: {
        name: this.title,
        slug: this.slug,
        short_intro: this.shortIntro,
        description: this.description,
      },
      $,
    });
    $.export("$summary", `Successfully created course with ID: ${response.uuid}`);
    return response;
  },
};
