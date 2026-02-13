import app from "../../bubble.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "bubble-search-things",
  name: "Search Things",
  description: "Searches for things (records) in your Bubble app's database with optional filtering, sorting, and pagination. [See the documentation](https://manual.bubble.io/core-resources/api/the-bubble-api/the-data-api/data-api-requests#get-a-list-of-things)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    typeName: {
      propDefinition: [
        app,
        "typeName",
      ],
    },
    constraints: {
      type: "string[]",
      label: "Constraints",
      description: "Array of search filters as JSON strings. Each constraint should be a JSON object with `key`, `constraint_type`, and `value` properties. Example: `{\"key\": \"name\", \"constraint_type\": \"equals\", \"value\": \"John\"}`. Supported constraint types: `equals`, `not equal`, `is_empty`, `is_not_empty`, `text contains`, `not text contains`, `greater than`, `less than`, `in`, `not in`, `contains`, `not contains`, `geographic_search`.",
      optional: true,
    },
    cursor: {
      type: "integer",
      label: "Cursor",
      description: "Starting position for pagination (rank of first item to return)",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of items to return (up to 50,000 for standard plans, 10,000,000 for Enterprise)",
      optional: true,
    },
    sortField: {
      type: "string",
      label: "Sort Field",
      description: "Field name to sort results by (defaults to creation date)",
      optional: true,
    },
    descending: {
      type: "boolean",
      label: "Descending",
      description: "Set to `true` to sort in descending order, `false` for ascending",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      typeName,
      constraints,
      cursor,
      limit,
      sortField,
      descending,
    } = this;

    const params = {};

    const parsedConstraints = utils.parseConstraints(constraints);
    if (parsedConstraints) {
      params.constraints = JSON.stringify(parsedConstraints);
    }

    const response = await app.searchThings({
      $,
      typeName,
      params: {
        cursor,
        limit,
        sort_field: sortField,
        descending: descending
          ? "true"
          : "false",
        ...params,
      },
    });

    const count = response.response?.results?.length || 0;
    $.export("$summary", `Successfully retrieved \`${count}\` \`${typeName}\` record(s)`);
    return response;
  },
};
