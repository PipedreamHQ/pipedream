import utils from "../../common/utils.mjs";
import app from "../../sheetdb.app.mjs";

export default {
  key: "sheetdb-create-rows",
  name: "Create Rows",
  description: "Create rows in a Google Sheet using the SheetDB API. [See the documentation](https://docs.sheetdb.io/sheetdb-api/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    data: {
      description: "An array of strings representing the rows to create in a Google Sheet as JSON objects. The keys inside the object should be the column names, and the values will be filled in the spreadsheet. The rows will be added at the end of the sheet. Eg. `[ { \"column1\": \"My Content\" } ]`",
      propDefinition: [
        app,
        "data",
      ],
    },
  },
  methods: {
    createRows(args = {}) {
      return this.app.post(args);
    },
  },
  async run({ $ }) {
    const {
      createRows,
      data,
    } = this;

    const response = await createRows({
      $,
      data: utils.parseArray(data),
    });

    if (response.error) {
      $.export("$summary", "No rows were created.");
      return response;
    }

    $.export("$summary", `Successfully created \`${response.created}\` row(s).`);

    return response;
  },
};
