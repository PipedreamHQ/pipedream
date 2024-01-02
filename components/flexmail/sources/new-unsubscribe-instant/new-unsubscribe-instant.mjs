import flexmail from "../../flexmail.app.mjs";

export default {
  key: "flexmail-new-unsubscribe-instant",
  name: "New Unsubscribe Instant",
  description: "Emit new event when a contact unsubscribes. [See the documentation](https://api.flexmail.eu/documentation/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    flexmail,
    contactId: {
      propDefinition: [
        flexmail,
        "contactId",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getUnsubscribeStatus() {
      return this.db.get("unsubscribeStatus") || false;
    },
    _setUnsubscribeStatus(status) {
      this.db.set("unsubscribeStatus", status);
    },
    generateMeta(data) {
      const ts = Date.now();
      const summary = `Contact ${data.contactId} unsubscribed`;
      return {
        id: data.contactId,
        summary,
        ts,
      };
    },
  },
  hooks: {
    async deploy() {
      const status = await this.flexmail.unsubscribeContact({
        contactId: this.contactId,
      });
      this._setUnsubscribeStatus(status);
    },
  },
  async run() {
    const currentStatus = await this.flexmail.unsubscribeContact({
      contactId: this.contactId,
    });
    const previousStatus = this._getUnsubscribeStatus();

    if (currentStatus !== previousStatus) {
      const data = {
        contactId: this.contactId,
        status: currentStatus,
      };
      const meta = this.generateMeta(data);
      this.$emit(data, meta);
      this._setUnsubscribeStatus(currentStatus);
    }
  },
};
