import softr from "../../softr.app.mjs";

export default {
  key: "softr-search-records",
  name: "Search Records",
  description: "Searches for records in a Softr database by field value. [See the documentation](https://docs.softr.io/softr-api/softr-database-api/records/search-records)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    softr,
    databaseId: {
      propDefinition: [
        softr,
        "databaseId",
      ],
    },
    tableId: {
      propDefinition: [
        softr,
        "tableId",
      ],
    },
    searchFieldName: {
      type: "string",
      label: "Search Field ID",
      description: "The ID of the field to search by (e.g., `sulHm`). Use the **List Fields** action to get the ID of a field.",
    },
    searchFieldValue: {
      type: "string",
      label: "Search Field Value",
      description: "The value to search for in the specified field (e.g., `John Doe`)",
    },
    searchOperator: {
      type: "string",
      label: "Search Operator",
      description: "The operator to use in the search",
      options: [
        "IS",
        "IS_NOT",
        "CONTAINS",
        "DOES_NOT_CONTAIN",
        "STARTS_WITH",
        "DOES_NOT_START_WITH",
        "ENDS_WITH",
        "DOES_NOT_END_WITH",
      ],
    },
    sortField: {
      type: "string",
      label: "Sort Field",
      description: "The ID of the field to sort the results by (e.g., `sulHm`). Use the **List Fields** action to get the ID of a field.",
      optional: true,
    },
    sortType: {
      type: "string",
      label: "Sort Type",
      description: "The type of sort to apply",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
    },
    fieldNames: {
      propDefinition: [
        softr,
        "fieldNames",
      ],
    },
    limit: {
      propDefinition: [
        softr,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        softr,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.softr.searchRecords({
      $,
      databaseId: this.databaseId,
      tableId: this.tableId,
      params: {
        fieldNames: this.fieldNames,
      },
      data: {
        filter: {
          condition: {
            operator: this.searchOperator,
            leftSide: this.searchFieldName,
            rightSide: this.searchFieldValue,
          },
        },
        sorting: [
          {
            sortingField: this.sortField,
            sortType: this.sortType,
          },
        ],
        paging: {
          limit: this.limit,
          offset: this.offset,
        },
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data.length} record${response.data.length !== 1
      ? "s"
      : ""}`);
    return response;
  },
};
