import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-get-contact-lists",
  name: "Get Contact Lists",
  description: "Allows you to get details of your contact lists. [See the docs here](https://docs.sendgrid.com/api-reference/lists/get-all-lists)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    numberOfLists: {
      type: "integer",
      label: "Max Number of Lists",
      description: "The maximum number of contact lists to return",
      optional: true,
      default: 20,
    },
  },
  async run({ $ }) {
    const resp = await this.sendgrid.getAllContactLists(this.numberOfLists);
    $.export("$summary", "Successfully retrieved lists");
    return resp;
  },
};
