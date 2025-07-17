import lark from "../../lark.app.mjs";

export default {
  key: "lark-create-new-lark-spreadsheet",
  name: "Create New Lark Spreadsheet",
  description: "Create a new spreadsheet in Lark. [See the documentation](https://open.larksuite.com/document/server-docs/docs/sheets-v3/spreadsheet/create)",
  version: "0.0.1",
  type: "action",
  props: {
    lark,
    spreadsheetTitle: {
      type: "string",
      label: "Spreadsheet Title",
      description: "The title of the new Lark spreadsheet",
      optional: true,
    },
    folderToken: {
      propDefinition: [
        lark,
        "folderToken",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.lark.createSpreadsheet({
      $,
      data: {
        title: this.spreadsheetTitle,
        folder_token: this.folderToken,
      },
    });

    $.export("$summary", `Successfully created spreadsheet with ID: ${response.data.spreadsheet.spreadsheet_token}`);
    return response;
  },
};
