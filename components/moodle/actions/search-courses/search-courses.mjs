import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-search-courses",
  name: "Search Courses",
  description: "Searches Moodle courses by name, module, block, or tag. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    moodle,
    criterianame: {
      type: "string",
      label: "Criteria Name",
      description: "The search criteria type",
      options: [
        "search",
        "modulelist",
        "blocklist",
        "tagid",
      ],
    },
    criteriavalue: {
      type: "string",
      label: "Criteria Value",
      description: "The value to search for",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to retrieve (0-indexed)",
      optional: true,
    },
    perpage: {
      type: "integer",
      label: "Per Page",
      description: "The number of results per page",
      optional: true,
    },
    limittoenrolled: {
      type: "boolean",
      label: "Limit to Enrolled",
      description: "If `true`, limit results to courses the user is enrolled in",
      optional: true,
    },
    onlywithcompletion: {
      type: "boolean",
      label: "Only With Completion",
      description: "If `true`, return only courses with completion enabled",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      criterianame: this.criterianame,
      criteriavalue: this.criteriavalue,
    };
    if (this.page !== undefined) params.page = this.page;
    if (this.perpage !== undefined) params.perpage = this.perpage;
    if (this.limittoenrolled !== undefined) params.limittoenrolled = this.limittoenrolled
      ? 1
      : 0;
    if (this.onlywithcompletion !== undefined) params.onlywithcompletion = this.onlywithcompletion
      ? 1
      : 0;

    const response = await this.moodle.searchCourses({
      $,
      params,
    });
    const courses = response?.courses ?? [];
    $.export("$summary", `Successfully found ${courses.length} course(s) matching "${this.criteriavalue}"`);
    return response;
  },
};
