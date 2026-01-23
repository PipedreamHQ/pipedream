import canvas from "../../canvas.app.mjs";

export default {
  key: "canvas-search-course-content",
  name: "Search Course Content",
  description: "Search for content in a course. [See the documentation](https://mitt.uib.no/doc/api/all_resources.html#method.smart_search.search)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    canvas,
    accountId: {
      propDefinition: [
        canvas,
        "accountId",
      ],
    },
    userId: {
      propDefinition: [
        canvas,
        "userId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    courseId: {
      propDefinition: [
        canvas,
        "courseId",
        (c) => ({
          userId: c.userId,
        }),
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for",
    },
  },
  async run({ $ }) {
    const results = await this.canvas.searchCourseContent({
      $,
      courseId: this.courseId,
      params: {
        q: this.query,
      },
    });
    $.export("$summary", `${results.length} result${results.length > 1
      ? "s"
      : ""} were found.`);
    return results;
  },
};
