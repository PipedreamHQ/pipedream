import vbout from "../../vbout.app.mjs";

export default {
  type: "source",
  name: "New Contact Property Change",
  key: "vbout-new-contact-property-change",
  description: "Emit new event for each new property changed in a specific contact. [See docs here](https://developers.vbout.com/docs#emailmarketing_getcontact)",
  version: "0.0.1",
  props: {
    vbout,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the vbout API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    list: {
      propDefinition: [
        vbout,
        "list",
      ],
      reloadProps: true,
      description: "Select the list to load contacts",
    },
    contact: {
      propDefinition: [
        vbout,
        "contact",
        (c) => ({
          listId: c.list.value,
        }),
      ],
    },
  },
  methods: {
    _getLastObject() {
      return this.db.get("lastObject");
    },
    _setLastObject(lastObject) {
      this.db.set("lastObject", lastObject);
    },
    getDataToEmit({
      id, email,
    }) {
      const ts = new Date().getTime();
      return {
        id,
        summary: `New property changed from contact (${email})`,
        ts,
      };
    },
  },
  async run() {
    const lastObject = this._getLastObject();
    const { contact } = await this.vbout.getContact({
      id: this.contact.value,
    });

    if (lastObject !== JSON.stringify(contact)) {
      this._setLastObject(JSON.stringify(contact));
      this.$emit(contact, this.getDataToEmit(contact));
    }
  },
};
