const mailgun = require("../../mailgun.app.js");

module.exports = {
  key: "mailgun-retrieve-mailinglist-member",
  name: "Mailgun Get Mailing List Member",
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
      return await this.mailgun.api("lists").members.createMember(this.list, this.address);
    } catch (err) {
      if (this.haltOnError) {
        throw err;
      }
      return err;
    }
  },
};
