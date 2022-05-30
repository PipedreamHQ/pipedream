import emailoctopus from "../../emailoctopus.app.mjs";

export default {
  name: "New List Contact",
  key: "emailoctopus-new-list-contact",
  description: "Emit new event each time a contact is added to a list.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    emailoctopus,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    listId: {
      propDefinition: [
        emailoctopus,
        "listId",
      ],
    },
  },
  async run() {
    const { data } = await this.emailoctopus.getContacts({
      listId: this.listId,
    });

    if (data.length) {
      for (let contact of data) {
        contact = await this.emailoctopus.getContact({
          listId: this.listId,
          contactId: contact.id,
        });

        this.$emit(contact, {
          id: contact.id,
          summary: `New contact added - ${contact.fields.FirstName} ${contact.fields.LastName} (${contact.email_address})`,
          ts: Date.now(),
        });
      }
    }
  },
};
