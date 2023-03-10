import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "oncehub-new-contact-updated",
  name: "New Contact Updated",
  description: "Emit new event when a contact is updated. [See the docs](https://developers.oncehub.com/reference/list-all-contacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      await this.processEvents({
        limit,
        "last_updated_time.gt": this.daysAgo(1),
      });
    },
    generateMeta({
      id, first_name: firstName, last_name: lastName, last_updated_time: lastUpdatedTime,
    }) {
      const ts = Date.parse(lastUpdatedTime);
      return {
        id: `${id}${ts}`,
        summary: firstName || lastName
          ? `${firstName || "" } ${lastName || "" }`
          : `Contact ID ${id}`,
        ts,
      };
    },
    async processEvents(params) {
      const { data } = await this.oncehub.listContacts({
        params,
      });
      if (!(data.length > 0)) {
        return;
      }
      data.forEach((contact) => this.emitEvent(contact));
      this._setLastTs(data[data.length - 1].last_updated_time);
    },
  },
  async run() {
    const lastUpdatedTime = this._getLastTs();
    await this.processEvents({
      "last_updated_time.gt": lastUpdatedTime,
    });
  },
};
