import app from "../../northflank.app.mjs";

export default {
  key: "northflank-get-domains",
  name: "Get Domains",
  description: "List all domains with pagination. [See the documentation](https://northflank.com/docs/v1/api/domains/list-domains)",
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
        data: { domains: resources }, pagination,
      } = await this.app.listDomains({
        $,
        data: {
          page,
        },
      });

      allResources = allResources.concat(resources);

      hasNextPage = pagination.hasNextPage;

      page++;
    }

    $.export("$summary", `Successfully retrieved the list of ${allResources.length} domains`);

    return allResources;
  },
};
