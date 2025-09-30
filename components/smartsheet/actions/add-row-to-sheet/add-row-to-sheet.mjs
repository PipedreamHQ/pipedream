import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-add-row-to-sheet",
  name: "Add Row to Sheet",
  description: "Adds a row to a sheet. [See docs here](https://smartsheet.redoc.ly/tag/rows#operation/rows-addToSheet)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
      reloadProps: true,
    },
    toTop: {
      type: "boolean",
      label: "To Top",
      description: "Set to `true` to add new row to the top of the sheet",
      optional: true,
      default: false,
    },
    cells: {
      type: "string[]",
      label: "Cells",
      description: "Array of objects representing cell values. Use to manually create row when `sheetId` is entered as a custom expression. Example: `{{ [{\"columnId\": 7960873114331012,\"value\": \"New status\"}] }}`",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    const { data: columns } = await this.smartsheet.listColumns(this.sheetId, {
      params: {
        include: "columnType",
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
      toTop,
      cells = [],
      smartsheet,
      ...columnProps
    } = this;

    const data = {
      cells: [],
    };
    if (toTop) {
      data.toTop = true;
    }
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

    const response = await smartsheet.addRow(sheetId, {
      data,
      $,
    });

    $.export("$summary", `Successfully created row with ID ${response.result.id}`);

    return response;
  },
};
