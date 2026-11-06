import app from "../../karbon.app.mjs";

export default {
  key: "karbon-list-users",
  name: "List Users",
  description: "List the staff users in your Karbon tenant, optionally filtered by name or email address. Use the `EmailAddress` field as the author or assignee in **Create Note**."
    + " [See the documentation](https://karbonhq.github.io/karbon-api-reference/#get-/v3/Users)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
      description: "An OData filter on `Name` or `EmailAddress` using `eq`, `contains` and `and`, e.g. `EmailAddress eq 'jane@example.com'`.",
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const records = await this.app.paginate({
      $,
      fn: this.app.listUsers,
      maxResults: this.maxResults,
      params: {
        $filter: this.filter,
      },
    });
    $.export("$summary", `Found ${records.length} user${records.length === 1
      ? ""
      : "s"}`);
    return records;
  },
};
