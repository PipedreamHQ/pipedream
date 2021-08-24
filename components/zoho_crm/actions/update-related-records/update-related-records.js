const {
  props,
  methods,
} = require("../common");
const validate = require("validate.js");
module.exports = {
  key: "zoho_crm-update-related-records",
  name: "Update Related Records",
  description:
    "Updates the relation between records from different modules. The following relations are supported: Campaigns - to - Leads, Contacts, Products - to - Leads, Accounts, Contacts, Potentials, Price Books.",
  version: "0.0.1",
  type: "action",
  props: {
    ...props,
    module: {
      propDefinition: [
        props.zoho_crm,
        "module",
      ],
      description: "Module of the record to relate.",
      options: [
        "Leads",
        "Accounts",
        "Contacts",
        "Potentials",
        "Price_Books",
      ],
    },
    recordId: {
      propDefinition: [
        props.zoho_crm,
        "recordId",
      ],
      description:
        "Unique identifier of the record you'd like to relate to another module.",
    },
    relatedModule: {
      type: "string",
      label: "Related Module",
      description: "Module on which the record will be related to.",
      options: [
        "Campaigns",
        "Products",
      ],
    },
    relatedData: {
      type: "string",
      label: "Related Data",
      description:
        "An array with the unique identifier of the record (`id`) in the related module, and its member estatus (`Member_Status`). Alternatively, provide a string that will `JSON.parse` to an array of objects with this structure. Example: `[{id:\"3652397000000327001\",Member_Status:\"Active\"},{id:\"3652397000001854001\",Member_Status:\"Planning\"}]`",
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
      relatedModule: {
        presence: true,
      },
      relatedData: {
        presence: true,
        arrayValidator: {
          value: this.relatedData,
          key: "related data",
        },
      },
    };
    validate.validators.arrayValidator = this.validateArray; //custom validator for object arrays
    const validationResult = validate(
      {
        module: this.module,
        recordId: this.recordId,
        relatedModule: this.relatedModule,
        relatedData: this.convertEmptyStringToUndefined(this.relatedData),
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.zoho_crm.updateRelatedRecords(
      this.module,
      this.recordId,
      this.relatedModule,
      this.getArrayObject(this.relatedData),
    );
  },
};
