import app from "../../sheetdb.app.mjs";

export default {
  key: "sheetdb-delete-rows",
  name: "Delete Rows",
  description: "Deletes the specified row(s) in a SheetDB sheet by matching a column name and value. [See the documentation](https://docs.sheetdb.io/sheetdb-api/delete#delete-with-single-query)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    columnName: {
      propDefinition: [
        app,
        "columnName",
      ],
    },
    columnValue: {
      propDefinition: [
        app,
        "columnValue",
      ],
    },
  },
  methods: {
    deleteRows({
      columnName, columnValue, ...args
    } = {}) {
      return this.app.delete({
        path: `/${columnName}/${encodeURIComponent(columnValue)}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteRows,
      columnName,
      columnValue,
    } = this;

    const response = await deleteRows({
      $,
      columnName,
      columnValue,
    });

    if (response.error) {
      $.export("$summary", "No rows were deleted.");
      return response;
    }

    $.export("$summary", `Successfully deleted \`${response.deleted}\` row(s).`);
    return response;
  },
};
