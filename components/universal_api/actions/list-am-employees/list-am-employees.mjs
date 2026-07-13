import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-list-am-employees",
  name: "List Asset Management Employees",
  description:
    "List employees from the Asset Management (AM) API on Universal API. Returns an array of AM employee objects (paginated internally, up to `maxResults`). This hits a different endpoint than **List HRIS Employees**. [See the documentation](https://docs.universalapi.io/reference/list-employees-1).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.paginate({
      fn: this.app.listAmEmployees,
      args: {
        $,
      },
      maxResults: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${response.length} AM employee(s)`);
    return response;
  },
};
