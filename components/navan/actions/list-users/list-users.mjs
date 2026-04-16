import app from "../../navan.app.mjs";

export default {
  key: "navan-list-users",
  name: "List Users",
  description: "Retrieves a paginated list of all users in the company. [See the documentation](https://u.pcloud.link/publink/show?code=XZ7Bww5ZoKb93VNf7ISOdR5UzVo6JzBLs7AX)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    startIndex: {
      type: "integer",
      label: "Start Index",
      description: "0-based index of first result. Default is 0.",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "Number of resources to return per page. Default is `10`.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "SCIM filter expression. Supported filters like `userName eq \"email@example.com\"`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      startIndex,
      count,
      filter,
    } = this;

    const response = await app.listUsers({
      $,
      params: {
        startIndex,
        count,
        filter,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.Resources?.length || 0} user(s) out of ${response.totalResults} total`);
    return response;
  },
};
