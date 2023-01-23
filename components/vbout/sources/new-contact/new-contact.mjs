import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Contact",
  key: "vbout-new-contact",
  description: "Emit new event for each new contact. [See docs here](https://developers.vbout.com/docs#emailmarketing_getcontacts)",
  version: "0.0.4",
  dedupe: "unique",
  props: {
    ...common.props,
    list: {
      propDefinition: [
        common.props.vbout,
        "list",
      ],
    },
  },
  methods: {
    ...common.methods,
    getDataToEmit({
      id, email,
    }) {
      const ts = new Date().getTime();
      return {
        id,
        summary: `New Contact (${email})`,
        ts,
      };
    },
    getDatetimeField() {
      return "registration_date";
    },
    async getRecords(params) {
      const toEmit = [];
      const records = this.vbout.paginate({
        fn: this.vbout.getContacts,
        params,
        field: "contacts",
      });
      for await (const record of records) {
        toEmit.push(record);
      }
      return toEmit;
    },
    async getItems() {
      const { contacts } = await this.vbout.getContacts({
        limit: 20,
        listid: this.list.value,
      });
      return contacts;
    },
    getParams() {
      return {
        limit: 99999999,
        listid: this.list.value,
      };
    },
  },
};
