import validate from "validate.js";
import common from "../common.mjs";

export default {
  ...common,
  key: "sendgrid-get-contact-lists",
  name: "Get Contact Lists",
  description: "Allows you to get details of your contact lists.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    numberOfLists: {
      type: "integer",
      label: "Number of Lists",
      description: "The number of contact lists to return",
    },
  },
  async run({ $ }) {
    const constraints = {
      numberOfLists: {
        numericality: {
          onlyInteger: true,
          greaterThan: 0,
          message: "must be positive integer, greater than zero",
        },
      },
    };
    const validationResult = validate(
      {
        numberOfLists: this.numberOfLists,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const resp = await this.sendgrid.getAllContactLists(this.numberOfLists);
    $.export("$summary", "Successfully retrieved lists");
    return resp;
  },
};
