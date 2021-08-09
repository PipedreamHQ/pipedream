const validate = require("validate.js");
const {
  props,
  methods,
} = require("../common");

module.exports = {
  key: "notion-get-page",
  name: "Get Page",
  description: "Gets details of a page given its identifier.",
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
  },
  methods: {
    ...methods,
  },
  async run() {
    const constraints = {
      pageId: {
        presence: true,
      },
    };
    const validationResult = validate(
      {
        pageId: this.pageId,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.notion.getPage(this.pageId);
  },
};
