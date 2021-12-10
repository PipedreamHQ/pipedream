const mailgun = require("../../mailgun.app.js");
const {
  props,
  methods,
} = require("../common");

module.exports = {
  key: "mailgun-delete-mailinglist-member",
  name: "Delete Mailing List Member",
  description: "Delete a mailing list member by address",
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
    const deleteMailingListMember = async function (mailgun, opts) {
      return await mailgun.api("lists").members.destroyMember(opts.list, opts.address);
    };
    return await this.withErrorHandler(deleteMailingListMember, {
      list: this.list,
      address: this.address,
    });
  },
};
