import app from "../../sendblue.app.mjs";

export default {
  key: "sendblue-get-contact-list",
  name: "Get Contact List",
  description: "Retrieve a list of your existing contacts from Sendblue. [See the documentation](https://docs.sendblue.com/api/resources/contacts/methods/list)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.app.getContactList({
      $,
    });

    $.export("$summary", "Successfully retrieved contact list");
    return response;
  },
};
