import app from "../../sheetdb.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sheetdb-update-rows",
  name: "Update Rows",
  description: "Updates the content for the specified row(s). [See the documentation](https://docs.sheetdb.io/sheetdb-api/update#update-with-single-query)",
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
    data: {
      label: "Data To Update",
      propDefinition: [
        app,
        "params",
      ],
    },
  },
  methods: {
    updateRows({
      columnName, columnValue, ...args
    } = {}) {
      return this.app.patch({
        path: `/${columnName}/${columnValue}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateRows,
      columnName,
      columnValue,
      data,
    } = this;

    const response = await updateRows({
      $,
      columnName,
      columnValue,
      data: JSON.stringify({
        data: Object.entries(utils.parse(data))
          .reduce((acc, [
            key,
            value,
          ]) => ({
            ...acc,
            [key]: value,
          }), {}),
      }),
    });

    if (response.error) {
      $.export("$summary", "No rows were updated.");
      return response;
    }

    $.export("$summary", `Successfully updated \`${response.updated}\` row(s).`);

    return response;
  },
};
