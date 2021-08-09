const validate = require("validate.js");
const {
  props,
  methods,
} = require("../common");

module.exports = {
  key: "notion-get-block-children",
  name: "Get Block Children",
  description:
    "Gets a list of child block objects contained in a block given its identifier.",
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
  },
  methods: {
    ...methods,
  },
  async run() {
    const constraints = {
      blockId: {
        presence: true,
      },
    };
    const validationResult = validate(
      {
        blockId: this.blockId,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.notion.getAllBlockChildren(
      this.blockId,
    );
  },
};
