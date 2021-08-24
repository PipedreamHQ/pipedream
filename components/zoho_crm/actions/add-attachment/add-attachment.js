const {
  props,
  methods,
} = require("../common");
const validate = require("validate.js");

module.exports = {
  key: "zoho_crm-add-attachment",
  name: "Add Attachment",
  description: "Adds a file attachment to the given module record.",
  version: "0.0.1",
  type: "action",
  props: {
    ...props,
    module: {
      propDefinition: [
        props.zoho_crm,
        "module",
      ],
      description: "The module related to the record you'd like to add the attachment.",
    },
    recordId: {
      propDefinition: [
        props.zoho_crm,
        "recordId",
      ],
    },
    fileName: {
      type: "string",
      label: "File Name",
      description:
        "Name of the file you'd like to attach. Pipedream will read the file contents off the workflow's `/tmp` folder.",
    },
  },
  methods: {
    ...methods,
  },
  async run() {
    const constraints = {
      recordId: {
        presence: true,
      },
      module: {
        presence: true,
      },
      fileName: {
        presence: true,
      },
    };
    const validationResult = validate(
      {
        recordId: this.recordId,
        module: this.module,
        fileName: this.fileName,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.zoho_crm.addAttachment(this.module, this.recordId, this.fileName);
  },
};
