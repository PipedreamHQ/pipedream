const mailgun = require("../../mailgun.app.js");
const {
  props,
  withErrorHandler,
} = require("../common");

module.exports = {
  key: "mailgun-delete-mailinglist-member",
  name: "Mailgun Delete Mailing List Member",
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
        "address",
      ],
    },
    ...props,
  },
  run: withErrorHandler(
    async function () {
      return await this.mailgun.api("lists").members.destroyMember(this.list, this.address);
    },
  ),
};
