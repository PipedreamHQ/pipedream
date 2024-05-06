import timetonic from "../../timetonic.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    timetonic,
    bookCode: {
      propDefinition: [
        timetonic,
        "bookCode",
      ],
    },
    tableId: {
      propDefinition: [
        timetonic,
        "tableId",
        (c) => ({
          bookCode: c.bookCode,
        }),
      ],
      reloadProps: true,
    },
  },
  methods: {
    isUpdate() {
      return false;
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.tableId || !this.bookCode) {
      return props;
    }
    const { bookTables: { categories } } = await this.timetonic.listTables({
      params: {
        b_c: this.bookCode,
        includeFields: true,
      },
    });
    const { fields } = categories.find(({ id }) => id === this.tableId);
    for (const field of fields) {
      if (!this.field?.readOnly) {
        props[`${field.id}`] = {
          type: constants.FIELD_TYPES[field.type] || "string",
          label: field.name,
          optional: this.isUpdate()
            ? true
            : !field?.required,
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      timetonic,
      // eslint-disable-next-line no-unused-vars
      bookCode,
      tableId,
      rowId = `tmp${Math.random().toString(36)
        .substr(2, 9)}`,
      ...fields
    } = this;
    const response = await timetonic.createOrUpdateRow({
      $,
      params: {
        rowId,
        catId: tableId,
        fieldValues: fields,
      },
    });
    $.export("$summary", `Successfully ${this.isUpdate()
      ? "updated"
      : "created"} row in table ${tableId}`);
    return response;
  },
};
