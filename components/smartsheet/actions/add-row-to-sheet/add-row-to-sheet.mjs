import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-add-row-to-sheet",
  name: "Add Row to Sheet",
  description: "Adds a row to a sheet. [See docs here](https://smartsheet.redoc.ly/tag/rows#operation/rows-addToSheet)",
  version: "0.0.1",
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
  },
  async additionalProps() {
    const props = {};
    const { data: columns } = await this.smartsheet.listColumns(this.sheetId, {
      params: {
        include: "columnType",
      },
    });
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
    /* eslint-disable no-unused-vars */
    const {
      sheetId,
      toTop,
      smartsheet,
      ...columnProps
    } = this;

    const data = {
      toTop,
      cells: [],
    };
    for (const key of Object.keys(columnProps)) {
      data.cells.push({
        columnId: key,
        value: columnProps[key],
      });
    }

    const response = await this.smartsheet.addRow(this.sheetId, {
      data,
      $,
    });

    $.export("$summary", `Successfully created row with ID ${response.result.id}`);

    return response;
  },
};
