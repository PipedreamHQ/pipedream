import seatable from "../../seatable.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    seatable,
    tableName: {
      propDefinition: [
        seatable,
        "tableName",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.tableName) {
      return props;
    }
    const { columns } = await this.seatable.listColumns({
      baseUuid: await this.seatable.getBaseUuid(),
      params: {
        table_name: this.tableName,
      },
    });
    for (const column of columns) {
      if (column.editable) {
        props[column.name] = {
          type: constants.COLUMN_TYPES[column.type] || "string",
          label: column.name,
          description: `Value of column ${column.name}. [See the docs](https://api.seatable.io/reference/models#supported-column-types) for info about supported column types`,
          optional: true,
        };
      }
    }
    return props;
  },
};
