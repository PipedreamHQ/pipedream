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
        const id = `${field.id}`;
        props[id] = {
          type: constants.FIELD_TYPES[field.type] || "string",
          label: field.name,
          optional: this.isUpdate()
            ? true
            : !field?.required,
        };
        if (field.type === "link") {
          const linkTableId = field.link.category.id;
          const { tableRows } = await this.timetonic.listRows({
            params: {
              catId: linkTableId,
            },
          });
          const options = tableRows?.map(({
            id, name: label,
          }) => ({
            value: `${id}`,
            label,
          })) || [];
          props[id].options = options;
          props[id].description = "The Row ID from the linked table to create a link to";
          tableRows.forEach(({
            id: rowId, name,
          }) => {
            props[`${id}_${rowId}_link_text`] = {
              type: "string",
              default: name,
              hidden: true,
            };
          });
        }
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      timetonic,
      // eslint-disable-next-line no-unused-vars
      isUpdate,
      // eslint-disable-next-line no-unused-vars
      bookCode,
      tableId,
      rowId = `tmp${Math.random().toString(36)
        .substr(2, 9)}`,
      ...fields
    } = this;

    const fieldValues = {};
    for (const [
      key,
      value,
    ] of Object.entries(fields)) {
      if (key.includes("link_text")) {
        continue;
      }
      fieldValues[+key] = fields[`${key}_${value}_link_text`]
        ? [
          {
            row_id: +value,
            value: fields[`${key}_${value}_link_text`],
          },
        ]
        : value;
    }
    const response = await timetonic.createOrUpdateRow({
      $,
      params: {
        rowId,
        catId: tableId,
        fieldValues,
      },
    });
    $.export("$summary", `Successfully ${this.isUpdate()
      ? "updated"
      : "created"} row in table ${tableId}`);
    return response;
  },
};
