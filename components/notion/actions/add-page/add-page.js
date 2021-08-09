const validate = require("validate.js");
const {
  props,
  methods,
} = require("../common");

module.exports = {
  key: "notion-add-page",
  name: "Add Page",
  description:
    "Adds a new page to the specified parent object, a database or an existing page.",
  version: "0.0.1",
  type: "action",
  props: {
    ...props,
    parent: {
      type: "object",
      label: "Database or Page Parent",
      description: "The new page [database parent](https://developers.notion.com/reference/page#database-parent) or [page parent](https://developers.notion.com/reference/page#page-parent) object.",
    },
    properties: {
      propDefinition: [
        props.notion,
        "properties",
      ],
    },
    content: {
      type: "string",
      label: "Page Content",
      description:
        "An array of [block objects](https://developers.notion.com/reference-link/block) to use as page content. Alternatively, provide a string that will `JSON.parse` to an array of block objects. Example `[{\"object\":\"block\",\"type\":\"paragraph\",\"paragraph\":{\"text\":[{\"type\":\"text\",\"text\":{\"content\":\"This is the paragraph content\"}}]}}]`",
      optional: true,
    },
  },
  methods: {
    ...methods,
  },
  async run() {
    const constraints = {
      parent: {
        presence: true,
      },
      properties: {
        presence: true,
      },
    };
    if (this.content) {
      validate.validators.arrayValidator = this.validateArray;
      constraints.content = {
        arrayValidator: {
          value: this.content,
          key: "block",
        },
      };
    }
    const validationResult = validate(
      {
        parent: this.parent,
        properties: this.properties,
        content: this.content,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const content = this.content ?
      this.getArrayObject(this.content) :
      null;
    return await this.notion.addPage(
      this.parent,
      this.properties,
      content,
    );
  },
};
