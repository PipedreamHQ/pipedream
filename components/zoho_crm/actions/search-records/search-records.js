const {
  props,
  methods,
} = require("../common");
const validate = require("validate.js");

module.exports = {
  key: "zoho_crm-search-records",
  name: "Search Records",
  description: "Retrieve the records that match your search criteria.",
  version: "0.0.1",
  type: "action",
  props: {
    ...props,
    criteria: {
      propDefinition: [
        props.zoho_crm,
        "criteria",
      ],
    },
    module: {
      propDefinition: [
        props.zoho_crm,
        "module",
      ],
      description: "Module that you'd like to search for records.",
    },
    converted: {
      type: "string",
      label: "Converted",
      description:
        "Determines whether converted records should be retrieved. `true` - get only converted records. `false` - get only non-converted records. `both` -  get all records.",
      options: [
        "true",
        "false",
        "both",
      ],
      default: "false",
    },
    approved: {
      type: "string",
      label: "Approved",
      description:
        "Determines whether approved records should be retrieved. `true` - get only approved records. `false` - get only non-approved records. `both` -  get all records.",
      options: [
        "true",
        "false",
        "both",
      ],
      default: "false",
    },
    numberOfRecords: {
      type: "integer",
      label: "Number of Records",
      description: "The number of module records to return.",
    },
  },
  methods: {
    ...methods,
  },
  async run() {
    const constraints = {
      criteria: {
        presence: true,
      },
      numberOfRecords: {
        presence: true,
      },
    };
    const validationResult = validate(
      {
        criteria: this.criteria,
        numberOfRecords: this.numberOfRecords,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const searchResultsGenerator = this.zoho_crm.searchRecords(
      this.module,
      this.criteria,
      this.numberOfRecords,
      this.converted,
      this.approved,
    );
    const searchResults = await this.getGeneratorResults(searchResultsGenerator);
    return searchResults;
  },
};
