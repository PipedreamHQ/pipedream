const {
  props,
  methods,
} = require("../common");
const validate = require("validate.js");

module.exports = {
  key: "zoho_crm-update-module-record",
  name: "Update Module Record",
  description: "Updates an existing record in the specified module.",
  version: "0.0.19",
  type: "action",
  props: {
    ...props,
    module: {
      propDefinition: [
        props.zoho_crm,
        "module",
      ],
      description: "Module where the record will be updated.",
    },
    recordId: {
      propDefinition: [
        props.zoho_crm,
        "recordId",
      ],
      description:
        "The unique identifier of the record you'd like to update.",
    },
    record: {
      propDefinition: [
        props.zoho_crm,
        "record",
      ],
      description:
        "The new record data. Depending on the selected module, certain fields must be presented in the record being updated. I.e. for Leads `Last_Name` is required, see more at Zoho CRM [Update Records](https://www.zoho.com/crm/developer/docs/api/v2/update-records.html) API docs.",
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
      recordId: {
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
        recordId: this.recordId,
        record: this.record,
        trigger: this.trigger,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.zoho_crm.updateModuleRecord(
      this.module,
      this.recordId,
      this.record,
      this.trigger,
    );
  },
};
