import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-create-contact-list",
  name: "Create Contact List",
  description: "Allows you to create a new contact list. [See the docs here](https://docs.sendgrid.com/api-reference/lists/create-list)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    name: {
      type: "string",
      label: "Name",
      description: "Your name for your list. maxLength: 100",
    },
  },
  async run({ $ }) {
    const resp = await this.sendgrid.createContactList(this.name);
    $.export("$summary", `Successfully created contact ${this.name}`);
    return resp;
  },
};
