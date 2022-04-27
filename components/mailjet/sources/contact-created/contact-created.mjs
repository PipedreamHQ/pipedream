import mailjetApp from "../../mailjet.app.mjs";

export default {
  key: "mailjet-contact-created",
  name: "Contact Created",
  description: "Emit new event when a contact is created. [See the docs here](https://dev.mailjet.com/email/reference/contacts/contact-list/#v3_get_contactslist)",
  type: "source",
  version: "0.0.1",
  props: {
    mailjetApp,
  },
  async run({ $ }) {},
};
