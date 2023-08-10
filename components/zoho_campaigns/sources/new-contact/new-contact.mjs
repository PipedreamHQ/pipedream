import common from "../common/common.mjs";

export default {
  type: "source",
  key: "zoho_campaigns-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is created.",
  version: "0.0.1",
  props: {
    ...common.props,
    mailingList: {
      propDefinition: [
        common.props.app,
        "mailingList",
      ],
    },
  },
  methods: {
    ...common.methods,
    _emitEvent(contact) {
      this.$emit(contact, {
        id: contact.zuid,
        summary: contact.contact_email,
        ts: Date.now(),
      });
    },
  },
  async run() {
    let page = 0;
    let startIndex = this._getStartIndex();

    while (true) {
      const res = await this.app.listContacts(page, startIndex, this.mailingList);
      console.log(res);

      if (res.status === "error" || res.list_of_details.length === 0) {
        break;
      }

      for (const contact of res.list_of_details) {
        this._emitEvent(contact);
      }
      startIndex += res.list_of_details.length;
      page++;
    }

    this._setStartIndex(startIndex);
  },
};
