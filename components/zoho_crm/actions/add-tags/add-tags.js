const {
  props,
  methods,
} = require("../common");
const validate = require("validate.js");

module.exports = {
  key: "zoho_crm-add-tags",
  name: "Add Tags",
  description: "Add new tags to an existing module record.",
  version: "0.0.28",
  type: "action",
  props: {
    ...props,
    module: {
      propDefinition: [
        props.zoho_crm,
        "module",
      ],
      description: "The module related to the record you'd like to add tags on.",
    },
    recordId: {
      propDefinition: [
        props.zoho_crm,
        "recordId",
      ],
      description: "Unique identifier of the module record you'd like to add tags on.",
    },
    tagNames: {
      type: "string[]",
      label: "Tag Names",
      description: "An string array of the names of the tags to be added.",
    },
    overWrite: {
      propDefinition: [
        props.zoho_crm,
        "overWrite",
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
      tagNames: {
        presence: true,
        type: "array",
      },
    };
    const validationResult = validate(
      {
        module: this.module,
        recordId: this.recordId,
        tagNames: this.tagNames,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.zoho_crm.addTags(
      this.module,
      this.recordId,
      this.tagNames,
      this.overWrite,
    );
  },
};
