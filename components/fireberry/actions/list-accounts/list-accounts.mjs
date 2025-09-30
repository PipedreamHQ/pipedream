import app from "../../fireberry.app.mjs";

export default {
  key: "fireberry-list-accounts",
  name: "List Accounts",
  description: "List all accounts in Fireberry. [See the documentation](https://developers.fireberry.com/reference/get-all-accounts)",
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
      const { data: { Records: resources } } = await this.app.getAllAccounts({
        $,
        data: {
          pageNumber: page,
        },
      });

      hasNextPage = resources.length > 0;

      allResources = allResources.concat(resources);

      page++;
    }

    $.export("$summary", `Successfully retrieved the list of ${allResources.length} projects`);

    return allResources;
  },
};
