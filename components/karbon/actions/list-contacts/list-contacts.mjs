import app from "../../karbon.app.mjs";

export default {
  key: "karbon-list-contacts",
  name: "List Contacts",
  description: "List the people in your Karbon tenant, optionally filtered by name, email address or phone number. Use the `ContactKey` field with **Get Contact**."
    + " [See the documentation](https://karbonhq.github.io/karbon-api-reference/#get-/v3/Contacts)",
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
      description: "An OData filter on `FullName`, `EmailAddress` or `PhoneNumber` using `eq`, `contains` and `and`, e.g. `contains(FullName, 'Sample')`.",
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
      fn: this.app.listContacts,
      maxResults: this.maxResults,
      params: {
        $filter: this.filter,
        $orderby: this.orderBy,
      },
    });
    $.export("$summary", `Found ${records.length} contact${records.length === 1
      ? ""
      : "s"}`);
    return records;
  },
};
