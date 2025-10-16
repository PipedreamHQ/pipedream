import mailgun from "../../mailgun.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "mailgun-retrieve-mailinglist-member",
  name: "Get Mailing List Member",
  description: "Retrieve a mailing list member by address. [See the docs here](https://documentation.mailgun.com/en/latest/api-mailinglists.html#mailing-lists)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mailgun,
    list: {
      propDefinition: [
        mailgun,
        "list",
      ],
    },
    address: {
      propDefinition: [
        mailgun,
        "email",
        (c) => ({
          list: c.list,
        }),
      ],
    },
    ...common.props,
  },
  async run({ $ }) {
    const resp = await this.withErrorHandler(this.mailgun.getMailingListMember, {
      list: this.list,
      address: this.address,
    });
    $.export("$summary", "Successfully retrieved mailing list member");
    return resp;
  },
};
