import timetonic from "../../timetonic.app.mjs";
import constants from "../../common/constants.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

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
        props[`id_${id}`] = {
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
            label: label || `${id}`,
          })) || [];
          props[`id_${id}`].options = options;
          props[`id_${id}`].description = "The Row ID from the linked table to create a link to";
          tableRows.forEach(({
            id: rowId, name,
          }) => {
            props[`${id}_${rowId}_link_text`] = {
              type: "string",
              default: name || `${rowId}`,
              hidden: true,
            };
          });
        }
        if (field.type === "file" || field.type === "files") {
          props[`id_${id}`].type = "string[]";
          props[`id_${id}`].description = "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).";
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
    async uploadFile($, fieldId, filePath, rowId) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(filePath);
      const formData = new FormData();
      formData.append("qqfile", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
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
      const id = parseInt(key.split("_")[1], 10);
      if (key.includes("link_text") || key.includes("is_file")) {
        continue;
      }
      if (fields[`${id}_is_file`]) {
        files.push({
          fieldId: id,
          filePath: value,
        });
        continue;
      }
      fieldValues[id] = fields[`${id}_${value}_link_text`]
        ? [
          {
            row_id: +value,
            value: fields[`${id}_${value}_link_text`],
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
