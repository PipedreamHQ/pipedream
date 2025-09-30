import { parseArray } from "../../common/utils.mjs";
import spreadsheetCom from "../../spreadsheet_com.app.mjs";

export default {
  key: "spreadsheet_com-create-rows",
  name: "Create Rows",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Adds new row(s) after last row that has data. Empty data sets are ignored. Provide data for at least 1 column. [See the documentation](https://developer.spreadsheet.com/#tag/Rows/operation/createRows)",
  type: "action",
  props: {
    spreadsheetCom,
    workbookId: {
      propDefinition: [
        spreadsheetCom,
        "workbookId",
      ],
    },
    worksheetId: {
      propDefinition: [
        spreadsheetCom,
        "worksheetId",
        ({ workbookId }) => ({
          workbookId,
        }),
      ],
    },
    position: {
      type: "string",
      label: "Position",
      description: "Position at which the row is to be added in the worksheet. If not specified, row is added after the last non-empty row in the worksheet. E.g. `S3vBb3FZRQuFtW1mrj0U2g:before`. [Where to find row Ids](https://developer.spreadsheet.com/#section/Using-the-API/Extract-Resource-IDs)",
      optional: true,
    },
    rowsData: {
      type: "string[]",
      label: "Rows Data",
      description: "Data row(s) to add. Each entry have the following sample format: `{ \"cellData\": [ { \"field\": \"A\", \"data\": \"Person\" }, { \"field\": \"B\", \"data\": \"Region\" } ] }`. Rows without any column data will be ignored. Maximum of 100 entries can be provided. [See the documentation](https://developer.spreadsheet.com/#tag/Rows/operation/createRows).",
    },
  },
  async run({ $ }) {
    const {
      spreadsheetCom,
      worksheetId,
      position,
      rowsData,
    } = this;

    const response = await spreadsheetCom.createRows({
      $,
      worksheetId,
      params: {
        position,
      },
      data: parseArray(rowsData),
    });

    $.export("$summary", `New row(s) with Id(s): ${(response.ids).toString()} ${response.ids.length > 1
      ? "were"
      : "was"} successfully created!`);
    return response;
  },
};
