import quickbase from "../../quickbase.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    quickbase,
    appId: {
      propDefinition: [
        quickbase,
        "appId",
      ],
    },
  },
  methods: {
    async getKeyFieldId() {
      const { keyFieldId } = await this.quickbase.getTable({
        tableId: this.tableId,
        params: {
          appId: this.appId,
        },
      });
      return keyFieldId;
    },
    async getFieldProps() {
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
    async buildRecordData(keyFieldId, data) {
      const fields = await this.quickbase.listFields({
        params: {
          tableId: this.tableId,
        },
      });
      const fieldsToReturn = [
        keyFieldId,
      ];
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
      return {
        fieldsToReturn,
        data,
      };
    },
  },
};
