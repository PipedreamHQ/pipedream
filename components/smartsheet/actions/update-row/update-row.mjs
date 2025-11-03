import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-update-row",
  name: "Update Row",
  description: "Updates a row in a sheet. [See docs here](https://smartsheet.redoc.ly/tag/rows#operation/update-rows)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smartsheet,
    sheetId: {
      propDefinition: [
        smartsheet,
        "sheetId",
      ],
    },
    rowId: {
      propDefinition: [
        smartsheet,
        "rowId",
        (c) => ({
          sheetId: c.sheetId,
        }),
      ],
      reloadProps: true,
    },
    cells: {
      type: "string[]",
      label: "Cells",
      description: "Array of objects representing cell values. Use to manually update row when `sheetId` is entered as a custom expression. Example: `{{ [{\"columnId\": 7960873114331012,\"value\": \"New status\"}] }}`",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (isNaN(this.rowId)) {
      return props;
    }
    const {
      cells, columns,
    } = await this.smartsheet.getRow(this.sheetId, this.rowId, {
      params: {
        include: "columns, columnType",
      },
    });
    if (!columns) {
      return props;
    }
    for (const column of columns) {
      props[column.id] = {
        type: "string",
        label: column.title,
        description: column?.description || "Enter the column value",
        optional: true,
        default: cells.find(({ columnId }) => columnId === column.id)?.value,
      };
      if (column.type.includes("CONTACT_LIST")) {
        props[column.id] = {
          ...props[column.id],
          options: async ({ page }) => {
            const { data } = await this.smartsheet.listContacts({
              params: {
                page,
              },
            });
            return data?.map(({ email }) => email ) || [];
          },
        };
      }
      else if (column?.options) {
        props[column.id].options = column.options;
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      sheetId,
      rowId,
      cells = [],
      smartsheet,
      ...columnProps
    } = this;

    const data = {
      id: rowId,
      cells: [],
    };
    for (const cell of cells) {
      const cellValue = typeof cell === "object"
        ? cell
        : JSON.parse(cell);
      data.cells.push(cellValue);
    }
    for (const key of Object.keys(columnProps)) {
      data.cells.push({
        columnId: key,
        value: columnProps[key],
      });
    }

    const response = await smartsheet.updateRow(sheetId, {
      data,
      $,
    });

    $.export("$summary", `Successfully updated row with ID ${rowId}`);

    return response;
  },
};
