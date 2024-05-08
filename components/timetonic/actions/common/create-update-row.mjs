import timetonic from "../../timetonic.app.mjs";
import constants from "../../common/constants.mjs";
import fs from "fs";
import FormData from "form-data";

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
      if (!field?.readOnly) {
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
        if (field.type === "file" || field.type === "files") {
          props[id].description = "The path to the file saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).";
          props[`${id}_is_file`] = {
            type: "boolean",
            default: true,
            hidden: true,
          };
        }
      }
    }
    return props;
  },
  methods: {
    isUpdate() {
      return false;
    },
    uploadFile($, fieldId, filePath, rowId) {
      const fileStream = fs.createReadStream(filePath.includes("/tmp")
        ? filePath
        : `/tmp/${filePath}`);
      const formData = new FormData();
      formData.append("qqfile", fileStream);
      return this.timetonic.uploadFile({
        $,
        params: {
          b_c: this.bookCode,
          fieldId,
          rowId,
        },
        data: formData,
        headers: formData.getHeaders(),
      });
    },
  },
  async run({ $ }) {
    const {
      timetonic,
      // eslint-disable-next-line no-unused-vars
      isUpdate,
      uploadFile,
      // eslint-disable-next-line no-unused-vars
      bookCode,
      tableId,
      rowId = `tmp${Math.random().toString(36)
        .substr(2, 9)}`,
      ...fields
    } = this;

    const fieldValues = {};
    const files = [];
    for (const [
      key,
      value,
    ] of Object.entries(fields)) {
      if (key.includes("link_text") || key.includes("is_file")) {
        continue;
      }
      if (fields[`${key}_is_file`]) {
        files.push({
          fieldId: key,
          filePath: value,
        });
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
    // if fieldValues is empty, createOrUpdateRow will create a new row
    // if updating, get and return the row instead
    const response = isUpdate() && !Object.entries(fieldValues).length
      ? await timetonic.getTableValues({
        $,
        params: {
          b_c: bookCode,
          catId: tableId,
          filterRowIds: {
            row_ids: [
              rowId,
            ],
          },
        },
      })
      : await timetonic.createOrUpdateRow({
        $,
        params: {
          rowId,
          catId: tableId,
          fieldValues,
        },
      });
    const newRowId = this.rowId || response.rows[0].id;
    for (const file of files) {
      await uploadFile($, file.fieldId, file.filePath, newRowId);
    }
    $.export("$summary", `Successfully ${isUpdate()
      ? "updated"
      : "created"} row in table ${tableId}`);
    return response;
  },
};
