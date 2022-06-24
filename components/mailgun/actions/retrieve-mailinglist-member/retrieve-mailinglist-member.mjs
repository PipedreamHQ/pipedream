import mailgun from "../../mailgun.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "mailgun-retrieve-mailinglist-member",
  name: "Get Mailing List Member",
  description: "Retrieve a mailing list member by address. [See the docs here](https://documentation.mailgun.com/en/latest/api-mailinglists.html#mailing-lists)",
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
    const retrieveMailingListMember = async function (mailgun, opts) {
      return await mailgun.api("lists").members.getMember(opts.list, opts.address);
    };
    return await this.withErrorHandler(retrieveMailingListMember, {
      list: this.list,
      address: this.address,
    });
  },
};
