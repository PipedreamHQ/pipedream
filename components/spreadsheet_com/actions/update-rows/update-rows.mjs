import { parseArray } from "../../common/utils.mjs";
import spreadsheetCom from "../../spreadsheet_com.app.mjs";

export default {
  key: "spreadsheet_com-update-rows",
  name: "Update Rows",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update existing row(s). [See the documentation](https://developer.spreadsheet.com/#tag/Rows/operation/updateRows)",
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
    rowsData: {
      type: "string[]",
      label: "Rows Data",
      description: "Data row(s) to update. Each entry have the following sample format: `{ \"_id\": \"WTwPho0VQp-goWf_xtSMgQ\", \"cellData\": [ { \"field\": \"A\", \"data\": \"Person\" }, { \"field\": \"B\", \"data\": \"Region\" } ] }`. Response will contain list of row ids for which the operation was successful. Maximum of 100 entries can be provided. [Where to find row Ids](https://developer.spreadsheet.com/#section/Using-the-API/Extract-Resource-IDs)",
    },
  },
  async run({ $ }) {
    const {
      spreadsheetCom,
      worksheetId,
      rowsData,
    } = this;

    const parsedData = parseArray(rowsData);

    const response = await spreadsheetCom.updateRows({
      $,
      worksheetId,
      data: parsedData,
    });

    $.export("$summary", `The row${parsedData.length > 1
      ? "s were"
      : " was"} successfully updated!`);
    return response;
  },
};
