import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-list-am-employees",
  name: "List Asset Management Employees",
  description:
    "List employees from the Asset Management (AM) API on Universal API. Returns a cursor-paginated array of AM employee objects. This hits a different endpoint than **List HRIS Employees**. [See the documentation](https://docs.universalapi.io/reference/list-employees-1).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listAmEmployees({
      $,
      cursor: this.cursor,
      limit: this.limit,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} AM employee(s)`);
    return response;
  },
};
