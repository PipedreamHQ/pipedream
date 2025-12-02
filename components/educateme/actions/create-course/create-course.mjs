import educateme from "../../educateme.app.mjs";

export default {
  key: "educateme-create-course",
  name: "Create Course",
  description: "Create a new course. [See the documentation](https://edme.notion.site/API-integration-v0-2-ef33641eb7f24fa9a6efb969c1f2928f)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    educateme,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the course",
    },
    type: {
      type: "string",
      label: "Course Type",
      description: "The type of the course",
      options: [
        "COHORT_BASED",
        "SELF_PACED",
      ],
    },
    previewUrl: {
      type: "string",
      label: "Preview URL",
      description: "The URL of the course preview",
      optional: true,
    },
    withProgramSyncing: {
      type: "boolean",
      label: "With Program Syncing",
      description: "Whether to sync the course with the program",
      optional: true,
    },
    duplicatedCourseId: {
      propDefinition: [
        educateme,
        "courseId",
      ],
      label: "Duplicated Course ID",
      description: "Optional. In case you need to copy a structure from another course",
      optional: true,
    },
  },
  async run({ $ }) {
    const { result } = await this.educateme.createCourse({
      $,
      data: {
        title: this.title,
        type: this.type,
        previewUrl: this.previewUrl,
        withProgramSyncing: this.withProgramSyncing,
        duplicatedCourseId: this.duplicatedCourseId,
      },
    });
    if (result?.id) {
      $.export("$summary", `Successfully created course with ID: ${result.id}`);
    }
    return result;
  },
};
