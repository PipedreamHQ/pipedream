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
        "Determines whether converted records should be retrieved. `Yes` - get only converted records. `No` - get only non-converted records. `Both` -  get all records ",
      options: [
        {
          label: "Yes",
          value: "true",
        },
        {
          label: "No",
          value: "false",
        },
        {
          label: "Both",
          value: "both",
        },
      ],
      default: "No",
    },
    approved: {
      type: "string",
      label: "Approved",
      description:
        "Determines whether approved records should be retrieved. `Yes` - get only approved records. `No` - get only non-approved records. `Both` -  get all records ",
      options: [
        {
          label: "Yes",
          value: "true",
        },
        {
          label: "No",
          value: "false",
        },
        {
          label: "Both",
          value: "both",
        },
      ],
      default: "Yes",
    },
    numberOfRecords: {
      type: "integer",
      label: "Number of Records",
      description: "The number of module records to return.",
    },
    fields: {
      propDefinition: [
        props.zoho_crm,
        "fields",
      ],
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
      this.fields,
    );
    const searchResults = await this.getGeneratorResults(searchResultsGenerator);
    return searchResults.slice(0, this.numberOfRecords);
  },
};
