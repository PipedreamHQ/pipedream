const validate = require("validate.js");
const {
  props,
  methods,
  ...common
} = require("../common");

module.exports = {
  ...common,
  key: "notion-add-content-to-page-or-block",
  name: "Add Content To Page Or Block",
  description:
    "Adds content to a specified page or block. In Notion, content is added via [blocks](https://developers.notion.com/reference/block), which can be headings, paragraphs, lists to dos, etc.",
  version: "0.0.1",
  type: "action",
  props: {
    ...props,
    blockId: {
      propDefinition: [
        props.notion,
        "blockId",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description:
        "An array of content objects to be added to a page (or container block).Alternatively, provide a string that will `JSON.parse` to an array of content objects. Example `[{\"object\":\"block\",\"type\":\"heading_2\",\"heading_2\":{\"text\":[{\"type\":\"text\",\"text\":{\"content\":\"Sample content\"}}]}}]`",
    },
  },
  methods: {
    ...methods,
  },
  async run() {
    validate.validators.arrayValidator = this.validateArray;
    const constraints = {
      blockId: {
        presence: true,
      },
      content: {
        presence: true,
        arrayValidator: {
          value: this.content,
          key: "content",
        },
      },
    };
    const validationResult = validate(
      {
        blockId: this.blockId,
        content: this.content,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const content = this.getArrayObject(this.content);
    return await this.notion.addContentToPageOrBlock(this.blockId, content);
  },
};
