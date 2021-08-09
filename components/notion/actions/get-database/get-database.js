const validate = require("validate.js");
const {
  props,
  methods,
} = require("../common");

module.exports = {
  key: "notion-get-database",
  name: "Get Database",
  description: "Gets details of a database given its identifier.",
  version: "0.0.1",
  type: "action",
  props: {
    ...props,
    databaseId: {
      propDefinition: [
        props.notion,
        "databaseId",
      ],
    },
  },
  methods: {
    ...methods,
  },
  async run() {
    const constraints = {
      databaseId: {
        presence: true,
      },
    };
    const validationResult = validate(
      {
        databaseId: this.databaseId,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.notion.getDatabase(this.databaseId);
  },
};
