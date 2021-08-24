const {
  props,
  methods,
} = require("../common");
const validate = require("validate.js");

module.exports = {
  key: "zoho_crm-create-or-update-record",
  name: "Create or Update Record",
  description:
    "Creates or update a record. The fields' values specified in prop `duplicateCheckFields` are used to check for duplicate records.",
  version: "0.0.1",
  type: "action",
  props: {
    ...props,
    module: {
      propDefinition: [
        props.zoho_crm,
        "module",
      ],
      description: "Module where the record will be created or updated.",
    },
    record: {
      propDefinition: [
        props.zoho_crm,
        "record",
      ],
      description:
        "The record data that will be used to create a new record, or to update an existing record with matching data in fields as per `duplicateCheckFields` prop.",
    },
    trigger: {
      propDefinition: [
        props.zoho_crm,
        "trigger",
      ],
    },
    duplicateCheckFields: {
      type: "string",
      label: "Duplicate Check Fields",
      description:
        "An array for the fields used to check for duplicate records (or alternatively, provide a string that will `JSON.parse` to an array of these fields objects). They can be **system-defined duplicate check fields** which are module-wise system-defined, or **user-defined unique fields** fields for which \"Do not allow duplicate values\" is enabled. See the relevant section in the [Upsert Records API Docs](https://www.zoho.com/crm/developer/docs/api/v2/upsert-records.html), and [User-Custom Fields, Mark Field as Unique](https://help.zoho.com/portal/en/kb/crm/customize-crm-account/customizing-fields/articles/use-custom-fields#Mark_a_Field_as_Unique) article respectively.",
      optional: true,
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
    const duplicateCheckFields = this.convertEmptyStringToUndefined(this.duplicateCheckFields);
    if (duplicateCheckFields) {
      validate.validators.arrayValidator = this.validateArray; //custom validator
      constraints.duplicateCheckFields = {
        arrayValidator: {
          value: this.duplicateCheckFields,
          key: "duplicate check fields",
        },
      };
    }
    if (this.trigger) {
      constraints.trigger = {
        type: "array",
      };
    }
    let validationResult = validate(
      {
        module: this.module,
        record: this.record,
        duplicateCheckFields: this.duplicateCheckFields,
        trigger: this.trigger,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.zoho_crm.upsertRecord(
      this.module,
      this.record,
      this.trigger,
      this.getArrayObject(this.duplicateCheckFields),
    );
  },
};
