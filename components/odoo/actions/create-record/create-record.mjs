import odoo from "../../odoo.app.mjs";

export default {
  key: "odoo-create-record",
  name: "Create Record",
  description: "Create a new record in Odoo. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#create-records)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    odoo,
    modelName: {
      propDefinition: [
        odoo,
        "modelName",
      ],
      reloadProps: true,
    },
    fieldsToSet: {
      type: "string[]",
      label: "Fields to Set",
      description: "Select optional fields to show in addition to required fields.",
      optional: true,
      reloadProps: true,
      options: async function () {
        return this.getOptionalFieldOptions();
      },
    },
  },
  async additionalProps() {
    const allFieldProps = await this.odoo.getFieldProps(this.modelName);
    const selected = Array.isArray(this.fieldsToSet)
      ? this.fieldsToSet
      : [];
    return Object.fromEntries(
      Object.entries(allFieldProps).filter(([
        key,
        prop,
      ]) => prop.optional === false || selected.includes(key)),
    );
  },
  methods: {
    async getOptionalFieldOptions() {
      const fieldProps = await this.odoo.getFieldProps(this.modelName);
      return Object.entries(fieldProps)
        .filter(([
          ,
          prop,
        ]) => prop.optional !== false)
        .map(([
          key,
          prop,
        ]) => ({
          value: key,
          label: prop.label
            ? `${prop.label} (${key})`
            : key,
        }));
    },
  },
  async run({ $ }) {
    const {
      odoo,
      // eslint-disable-next-line no-unused-vars
      getOptionalFieldOptions,
      modelName,
      // eslint-disable-next-line no-unused-vars
      fieldsToSet,
      ...data
    } = this;
    const payload = Object.fromEntries(Object.entries(data).filter(([
      ,
      value,
    ]) => value !== undefined));
    const response = await odoo.createRecord(modelName, [
      payload,
    ]);
    $.export("$summary", `Successfully created record with ID: ${response}`);
    return response;
  },
};
