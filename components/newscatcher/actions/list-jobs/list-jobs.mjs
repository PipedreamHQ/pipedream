import newscatcher from "../../newscatcher.app.mjs";

export default {
  key: "newscatcher-list-jobs",
  name: "List Jobs",
  description: "List all jobs in Newscatcher. [See the documentation](https://www.newscatcherapi.com/docs/web-search-api/api-reference/jobs/list-user-jobs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    newscatcher,
    page: {
      propDefinition: [
        newscatcher,
        "page",
      ],
    },
    pageSize: {
      propDefinition: [
        newscatcher,
        "pageSize",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.newscatcher.listJobs({
      $,
      params: {
        page: this.page,
        page_size: this.pageSize,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.jobs?.length || 0} job${response.jobs?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
