import app from "../../karbon.app.mjs";

export default {
  key: "karbon-list-organizations",
  name: "List Organizations",
  description: "List the organizations in your Karbon tenant, optionally filtered by name, email address or external key."
    + " [See the documentation](https://karbonhq.github.io/karbon-api-reference/#get-/v3/Organizations)",
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
      description: "An OData filter on `FullName`, `EmailAddress` or `ExternalKey` using `eq` and `and`, e.g. `FullName eq 'Sample Company'`.",
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "How to sort the results, e.g. `FullName desc`.",
      options: [
        "FullName",
        "FullName desc",
        "LastModifiedDateTime",
        "LastModifiedDateTime desc",
      ],
      optional: true,
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
      fn: this.app.listOrganizations,
      maxResults: this.maxResults,
      params: {
        $filter: this.filter,
        $orderby: this.orderBy,
      },
    });
    $.export("$summary", `Found ${records.length} organization${records.length === 1
      ? ""
      : "s"}`);
    return records;
  },
};
