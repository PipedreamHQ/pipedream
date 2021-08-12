const validate = require("validate.js");
const {
  props,
  methods,
} = require("../common");

module.exports = {
  key: "notion-create-database",
  name: "Create Database",
  description: "Creates a database as a subpage in the specified parent page, with the specified properties schema.",
  version: "0.0.1",
  type: "action",
  props: {
    ...props,
    pageId: {
      propDefinition: [
        props.notion,
        "pageId",
      ],
      label: "Parent Page Id",
      description: "Unique identifier of the parent page.",
    },
    title: {
      type: "string",
      label: "Title",
      description:
        "Title of database as it appears in Notion as an array of [rich text objects](https://developers.notion.com/reference-link/rich-text). Alternatively, provide a string that will `JSON.parse` to an array of rich text objects. Example: `[{\"type\": \"text\",\"text\": {\"content\": \"Grocery List\",\"link\": null}}]`",
      optional: true,
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
    let title = this.convertEmptyStringToUndefined(this.title);
    if (this.title) {
      validate.validators.arrayValidator = this.validateArray; //custom validator for object arrays
      constraints.title = {
        arrayValidator: {
          value: title,
          key: "rich text",
        },
      };
    }
    const validationResult = validate(
      {
        pageId: this.pageId,
        properties: this.properties,
        title,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    title  = this.getArrayObject(title);
    return await this.notion.createDatabase(this.pageId, title, this.properties);
  },
};
