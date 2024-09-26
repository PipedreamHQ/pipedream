import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "wildapricot-new-contact-or-member-updated",
  name: "New Contact or Member Updated",
  description: "Emit new event when a contact or member in WildApricot is updated",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(contact) {
      const ts = Date.parse(contact.ProfileLastUpdated);
      return {
        id: `${contact.Id}-${ts}`,
        summary: `New or Updated Contact ${contact.Id}`,
        ts,
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    const limit = constants.DEFAULT_LIMIT;
    const params = {
      "$top": limit,
      "$skip": 0,
    };
    let total;
    do {
      const contacts = await this.wildapricot.listContacts({
        accountId: this.accountId,
        params,
      });
      for (const contact of contacts) {
        const ts = Date.parse(contact.ProfileLastUpdated);
        if (ts >= lastTs) {
          maxTs = Math.max(ts, maxTs);
          const meta = this.generateMeta(contact);
          this.$emit(contact, meta);
        }
      }
      params["$skip"] += limit;
      total = contacts?.length;
    } while (total === limit);
    this._setLastTs(maxTs);
  },
  sampleEmit,
};
