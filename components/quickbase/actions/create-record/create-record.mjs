import quickbase from "../../quickbase.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "quickbase-create-record",
  name: "Create Record",
  description: "Creates a new record in a Quick Base table. [See the documentation](https://developer.quickbase.com/operation/upsert)",
  version: "0.0.1",
  type: "action",
  props: {
    quickbase,
    appId: {
      propDefinition: [
        quickbase,
        "appId",
      ],
    },
    tableId: {
      propDefinition: [
        quickbase,
        "tableId",
        (c) => ({
          appId: c.appId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.tableId) {
      return props;
    }
    const fields = await this.quickbase.listFields({
      params: {
        tableId: this.tableId,
      },
    });
    for (const field of fields) {
      const type = constants.FIELD_TYPES[field.fieldType];
      if (!type) {
        continue;
      }
      props[field.id] = {
        type,
        label: field.label,
        description: `Value for field "${field.label}". See the [field-types page](https://developer.quickbase.com/fieldInfo) for more information about field types.`,
        optional: !field.required,
      };
    }
    return props;
  },
  async run({ $ }) {
    const fields = await this.quickbase.listFields({
      params: {
        tableId: this.tableId,
      },
    });
    const data = [
      {},
    ];
    const fieldsToReturn = [];
    for (const field of fields) {
      fieldsToReturn.push(field.id);
      if (this[field.id]) {
        data[0][field.id] = {
          value: constants.NUMERIC_FIELD_TYPES.includes(field.fieldType)
            ? +this[field.id]
            : constants.OBJECT_FIELD_TYPES.includes(field.fieldType)
              ? JSON.parse(this[field.id])
              : this[field.id],
        };
      }
    }
    const response = await this.quickbase.createOrUpdateRecord({
      $,
      data: {
        to: this.tableId,
        data,
        fieldsToReturn,
      },
    });
    $.export("$summary", `Successfully created record in table ${this.tableId}`);
    return response;
  },
};
