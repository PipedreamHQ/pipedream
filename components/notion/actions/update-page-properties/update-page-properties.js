const validate = require("validate.js");
const {
  props,
  methods,
} = require("../common");

module.exports = {
  key: "notion-update-page-properties",
  name: "Update Page Properties",
  description: "Updates the property values of the specified page.",
  version: "0.0.1",
  type: "action",
  props: {
    ...props,
    pageId: {
      propDefinition: [
        props.notion,
        "pageId",
      ],
    },
    properties: {
      propDefinition: [
        props.notion,
        "properties",
      ],
    },
  },
  methods: {
    ...methods,
  },
  async run() {
    const constraints = {
      pageId: {
        presence: true,
      },
      properties: {
        presence: true,
      },
    };
    const validationResult = validate(
      {
        pageId: this.pageId,
        properties: this.properties,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.notion.updatePageProperties(this.pageId, this.properties);
  },
};
