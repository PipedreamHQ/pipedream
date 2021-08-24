const {
  props,
  methods,
} = require("../common");
const validate = require("validate.js");

module.exports = {
  key: "zoho_crm-create-module-record",
  name: "Create Module Record",
  description: "Creates a new record in the specified module.",
  version: "0.0.1",
  type: "action",
  props: {
    ...props,
    module: {
      propDefinition: [
        props.zoho_crm,
        "module",
      ],
    },
    record: {
      propDefinition: [
        props.zoho_crm,
        "record",
      ],
    },
    trigger: {
      propDefinition: [
        props.zoho_crm,
        "trigger",
      ],
    },
  },
  methods: {
    ...methods,
  },
  async run() {
    const constraints = {
      module: {
        presence: true,
      },
      record: {
        presence: true,
      },
    };
    if (this.trigger) {
      constraints.trigger = {
        type: "array",
      };
    }
    const validationResult = validate(
      {
        module: this.module,
        record: this.record,
        trigger: this.trigger,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.zoho_crm.createModuleRecord(this.module, this.record, this.trigger);
  },
};
