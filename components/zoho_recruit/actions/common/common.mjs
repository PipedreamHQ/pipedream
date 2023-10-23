import zohoRecruit from "../../zoho_recruit.app.mjs";
import { FIELD_TYPES } from "../../common/constants.mjs";

export default {
  props: {
    zohoRecruit,
    module: {
      propDefinition: [
        zohoRecruit,
        "module",
      ],
    },
    fields: {
      propDefinition: [
        zohoRecruit,
        "fields",
        (c) => ({
          moduleName: c.module,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.fields?.length) {
      return props;
    }
    const fields = await this.getFields();
    for (const field of this.fields) {
      const fieldObj = fields.find(({ api_name: name }) => name === field);
      if (!fieldObj) {
        continue;
      }
      props[field] = {
        type: FIELD_TYPES[fieldObj.json_type],
        label: `${field} Value`,
      };
    }
    return props;
  },
  methods: {
    async getFields() {
      const { fields } = await this.zohoRecruit.listFields({
        params: {
          module: this.module,
        },
      });
      return fields;
    },
    buildData() {
      const record = {};
      for (const field of this.fields) {
        record[field] = this[field];
      }
      const data = {
        data: [
          record,
        ],
      };
      return data;
    },
  },
};
