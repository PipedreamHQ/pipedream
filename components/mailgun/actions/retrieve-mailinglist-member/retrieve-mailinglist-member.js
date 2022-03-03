const mailgun = require("../../mailgun.app.js");
const {
  props,
  methods,
} = require("../common");

module.exports = {
  key: "mailgun-retrieve-mailinglist-member",
  name: "Get Mailing List Member",
  description: "Retrieve a mailing list member by address",
  version: "0.0.1",
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
    ...props,
  },
  methods: {
    ...methods,
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
