import mailgun from "../../mailgun.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "mailgun-delete-mailinglist-member",
  name: "Delete Mailing List Member",
  description: "Delete a mailing list member by address. [See the docs here](https://documentation.mailgun.com/en/latest/api-mailinglists.html#mailing-lists)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const resp = await this.withErrorHandler(this.mailgun.deleteMailingListMember, {
      list: this.list,
      address: this.address,
    });
    $.export("$summary", "Successfully deleted mailinglist member.");
    return resp;
  },
};
