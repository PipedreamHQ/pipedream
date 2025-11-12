import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  key: "clientify-contact-added",
  name: "New Contact Created",
  version: "0.0.2",
  description: "Emit new event when a new contact is created.",
  methods: {
    ...common.methods,
    getFunction() {
      return this.clientify.listContacts;
    },
    getSummary({ id }) {
      return `A new contact with id: "${id}" was created!`;
    },
    getParams(lastDate) {
      return {
        "orderBy": "created",
        "created[gte]": lastDate,
      };
    },
  },
};
