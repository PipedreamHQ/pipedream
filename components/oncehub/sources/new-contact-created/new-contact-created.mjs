import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "oncehub-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the docs](https://developers.oncehub.com/reference/list-all-contacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      await this.processEvents({
        limit,
        "creation_time.gt": this.daysAgo(1),
      });
    },
    generateMeta({
      id, first_name: firstName, last_name: lastName, creation_time: creationTime,
    }) {
      return {
        id: id,
        summary: firstName || lastName
          ? `${firstName || "" } ${lastName || "" }`
          : `Contact ID ${id}`,
        ts: Date.parse(creationTime),
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
      this._setLastTs(data[data.length - 1].creation_time);
    },
  },
  async run() {
    const lastCreationTime = this._getLastTs();
    await this.processEvents({
      "creation_time.gt": lastCreationTime,
    });
  },
};
