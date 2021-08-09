const validate = require("validate.js");
const {
  props,
  methods,
} = require("../common");

module.exports = {
  key: "notion-get-user",
  name: "Get User",
  description: "Gets details of a user given its identifier.",
  version: "0.0.1",
  type: "action",
  props: {
    ...props,
    userId: {
      type: "string",
      label: "User Id",
      description: "Unique identifier of the user to get details of.",
      async options() {
        const options = [];
        const users = await this.notion.getAllUsers();
        users.forEach( (user) =>  {
          options.push({
            label: user.name,
            value: user.id,
          });
        });
        return options;
      },
      optional: true,
    },
  },
  methods: {
    ...methods,
  },
  async run() {
    const constraints = {
      userId: {
        presence: true,
      },
    };
    const validationResult = validate(
      {
        userId: this.userId,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.notion.getUser(this.userId);
  },
};
