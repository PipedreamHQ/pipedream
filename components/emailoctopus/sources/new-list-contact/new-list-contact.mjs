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
    const params = {
      listId: this.listId,
    };

    const contacts = [];
    const paginator = this.emailoctopus.paginate({
      fn: this.emailoctopus.getContacts,
      params,
    });
    for await (const contact of paginator) {
      contacts.push(contact);
    }

    for (let contact of contacts) {
      contact = await this.emailoctopus.getContact({
        listId: this.listId,
        contactId: contact.id,
      });

      this.$emit(contact, {
        id: contact.id,
        summary: `New contact added - ${contact.fields.FirstName} ${contact.fields.LastName} (${contact.email_address})`,
        ts: contact.created_at,
      });
    }
  },
};
