// eslint-disable-next-line camelcase
const zoho_crm = require("../../zoho_crm.app");
const { methods } = require("../common");
const validate = require("validate.js");

module.exports = {
  key: "zoho_crm-add-tags",
  name: "Add Tags",
  description: "Add new tags to an existing module record.",
  version: "0.0.18",
  type: "action",
  props: {
    zoho_crm,
    domain: {
      propDefinition: [
        // eslint-disable-next-line camelcase
        zoho_crm,
        "domain",
      ],
    },
    module: {
      type: "string",
      label: "Module",
      description:
        "The module related to the record you'd like to add tags on.",
      options: [
        "Leads",
        "Accounts",
        "Contacts",
        "Deals",
        "Campaigns",
        "Tasks",
        "Cases",
        "Events",
        "Calls",
        "Solutions",
        "Products",
        "Vendors",
        "Price_Books",
        "Quotes",
        "Sales_Orders",
        "Purchase_Orders",
        "Invoices",
        "Custom",
        "Notes",
      ],
    },
    recordId: {
      type: "string",
      label: "Record Id",
      description:
        "Unique identifiers of the module record you'd like to add tags on.",
    },
    tagNames: {
      type: "string[]",
      label: "Tag Names",
      description: "An string array of the names of the tags to be added.",
    },
    overWrite: {
      type: "boolean",
      label: "Overwrite?",
      description: "Specifies if the existing tags are to be overwritten.",
      default: false,
    },
  },
  methods: {
    ...methods,
  },
  async run() {
    const constraints = {
      domain: {
        presence: true,
      },
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
        domain: this.domain,
        module: this.module,
        recordId: this.recordId,
        tagNames: this.tagNames,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    //
    const baseUrl = this.zoho_crm._apiUrl(this.domain);
    const url = `${baseUrl}/${this.module}/${this.recordId}/actions/add_tags`;
    const requestConfig = {
      url,
      method: "POST",
      headers: this.zoho_crm._makeRequestConfig().headers,
      params: {
        tag_names: this.tagNames.join(","),
        over_write: this.overWrite,
      },
    };
    console.log(JSON.stringify(requestConfig));
    //
    return await this.zoho_crm.addTags(
      this.domain,
      this.module,
      this.recordId,
      this.tagNames,
      this.overWrite,
    );
  },
};
