import { parseObject } from "../../common/utils.mjs";
import microsoftExcel from "../../microsoft_excel.app.mjs";

export default {
  key: "microsoft_excel-add-a-worksheet-tablerow",
  name: "Add A Worksheet Tablerow",
  version: "0.0.4",
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
    itemId: {
      propDefinition: [
        microsoftExcel,
        "itemId",
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
        ({ itemId }) => ({
          itemId,
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
    if (this.itemId) {
      try {
        await this.microsoftExcel.listTables({
          itemId: this.itemId,
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
      itemId,
      tableId,
      tableName,
      values,
    } = this;

    const response = await microsoftExcel.addRow({
      $,
      itemId,
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
