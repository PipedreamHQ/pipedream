const mailgun = require("../../mailgun.app.js");

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
    haltOnError: {
      propDefinition: [
        mailgun,
        "haltOnError",
      ],
    },
  },
  async run () {
    try {
      return await this.mailgun.api("lists").members.destroyMember(this.list, this.address);
    } catch (err) {
      if (this.haltOnError) {
        throw err;
      }
      return err;
    }
  },
};
