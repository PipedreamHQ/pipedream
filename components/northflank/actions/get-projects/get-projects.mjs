import app from "../../northflank.app.mjs";

export default {
  key: "northflank-get-projects",
  name: "Get Projects",
  description: "Lists all projects with pagination. [See the documentation](https://northflank.com/docs/v1/api/projects/list-projects)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    let hasNextPage = true;
    let page = 0;
    let allResources = [];

    while (hasNextPage) {
      const {
        data: { projects: resources }, pagination,
      } = await this.app.listProjects({
        $,
        data: {
          page,
        },
      });

      allResources = allResources.concat(resources);

      hasNextPage = pagination.hasNextPage;

      page++;
    }

    $.export("$summary", `Successfully retrieved the list of ${allResources.length} projects`);

    return allResources;
  },
};
