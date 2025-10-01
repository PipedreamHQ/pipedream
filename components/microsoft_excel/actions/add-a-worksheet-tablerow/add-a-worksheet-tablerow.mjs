import { parseObject } from "../../common/utils.mjs";
import microsoftExcel from "../../microsoft_excel.app.mjs";

export default {
  key: "microsoft_excel-add-a-worksheet-tablerow",
  name: "Add a Worksheet Tablerow",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Adds rows to the end of specific table. [See the documentation](https://learn.microsoft.com/en-us/graph/api/tablerowcollection-add?view=graph-rest-1.0&tabs=http)",
  type: "action",
  props: {
    microsoftExcel,
    folderId: {
      propDefinition: [
        microsoftExcel,
        "folderId",
      ],
    },
    sheetId: {
      propDefinition: [
        microsoftExcel,
        "sheetId",
        ({ folderId }) => ({
          folderId,
        }),
      ],
      reloadProps: true,
    },
    tableId: {
      propDefinition: [
        microsoftExcel,
        "tableId",
        ({ sheetId }) => ({
          sheetId,
        }),
      ],
      hidden: true,
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "This is set in the **Table Design** tab of the ribbon.",
      hidden: true,
    },
    values: {
      propDefinition: [
        microsoftExcel,
        "values",
      ],
    },
  },
  async additionalProps(props) {
    if (this.sheetId) {
      try {
        await this.microsoftExcel.listTables({
          sheetId: this.sheetId,
        });
      } catch {
        props.tableName.hidden = false;
        return {};
      }
      props.tableId.hidden = false;
      return {};
    }
  },
  async run({ $ }) {
    const {
      microsoftExcel,
      sheetId,
      tableId,
      tableName,
      values,
    } = this;

    const response = await microsoftExcel.addTableRow({
      $,
      sheetId,
      tableId,
      tableName,
      data: {
        values: parseObject(values),
      },
    });

    $.export("$summary", "The rows were successfully added!");
    return response;
  },
};
