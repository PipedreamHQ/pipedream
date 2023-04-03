import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-update-row",
  name: "Update Row",
  description: "Updates a row in a sheet. [See docs here](https://smartsheet.redoc.ly/tag/rows#operation/update-rows)",
  version: "0.0.1",
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
  },
  async additionalProps() {
    const props = {};
    const {
      cells, columns,
    } = await this.smartsheet.getRow(this.sheetId, this.rowId, {
      params: {
        include: "columns, columnType",
      },
    });
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
    /* eslint-disable no-unused-vars */
    const {
      sheetId,
      rowId,
      smartsheet,
      ...columnProps
    } = this;

    const data = {
      id: rowId,
      cells: [],
    };
    for (const key of Object.keys(columnProps)) {
      data.cells.push({
        columnId: key,
        value: columnProps[key],
      });
    }

    const response = await this.smartsheet.updateRow(this.sheetId, {
      data,
      $,
    });

    $.export("$summary", `Successfully updated row with ID ${rowId}`);

    return response;
  },
};
