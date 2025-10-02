import workday from "../../workday.app.mjs";

export default {
  key: "workday-search-workers",
  name: "Search Workers",
  description: "Retrieve a list of workers based on a search query. [See the documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#common/v1/get-/workers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    search: {
      type: "string",
      label: "Search",
      description: "The search query to use to filter workers",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        workday,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = this.workday.paginate({
      fn: this.workday.listWorkers,
      args: {
        $,
        params: {
          search: this.search,
        },
      },
      max: this.maxResults,
    });

    const data = [];
    for await (const result of results) {
      data.push(result);
    }

    $.export("$summary", `Successfully fetched ${data.length} workers`);
    return data;
  },
};
