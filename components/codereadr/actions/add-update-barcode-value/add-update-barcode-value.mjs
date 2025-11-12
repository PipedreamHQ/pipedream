import app from "../../codereadr.app.mjs";

export default {
  key: "codereadr-add-update-barcode-value",
  name: "Add or Update Barcode Value",
  description: "Adds or updates a barcode value in the selected database. [See the documentation](https://secure.codereadr.com/apidocs/Databases.md#upsertvalue)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    databaseId: {
      propDefinition: [
        app,
        "databaseId",
      ],
    },
    value: {
      propDefinition: [
        app,
        "value",
      ],
    },
    responseStr: {
      type: "string",
      label: "Response",
      description: "A string which specifies the barcode value's associated response text.",
      optional: true,
    },
  },
  methods: {
    addOrUpdateBarcode({
      params, ...args
    } = {}) {
      return this.app.upsertvalue({
        ...args,
        params: {
          ...params,
          section: "databases",
        },
      });
    },
  },
  async run({ $ }) {
    const {
      addOrUpdateBarcode,
      databaseId,
      value,
      responseStr,
    } = this;

    const response = await addOrUpdateBarcode({
      $,
      params: {
        database_id: databaseId,
        value,
        response: responseStr,
      },
    });
    $.export("$summary", `Successfully added or updated barcode value \`${value}\` in database with ID \`${databaseId}\``);
    return response;
  },
};
