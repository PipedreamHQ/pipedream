import mailgun from "../../mailgun.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "mailgun-delete-mailinglist-member",
  name: "Delete Mailing List Member",
  description: "Delete a mailing list member by address. [See the docs here](https://documentation.mailgun.com/en/latest/api-mailinglists.html#mailing-lists)",
  version: "0.0.2",
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
      ],
    },
    ...common.props,
  },
  async run() {
    const deleteMailingListMember = async function (mailgun, opts) {
      return await mailgun.api("lists").members.destroyMember(opts.list, opts.address);
    };
    return await this.withErrorHandler(deleteMailingListMember, {
      list: this.list,
      address: this.address,
    });
  },
};
