import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "freshmarketer-new-contact-added-to-list",
  name: "New Contact Added to List",
  description: "Emit new event when a contact is added to a specific list.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(contact) {
      return `Contact ${contact.email} added to list ${this.listId}`;
    },
    async prepareData({
      data,
      lastDate,
      maxResults,
    }) {
      const responseArray = [];
      for await (const item of data) {
        if (Date.parse(item.updated_at) <= Date.parse(lastDate)) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0].updated_at);
      if (maxResults && responseArray.length > maxResults) {
        responseArray.length = maxResults;
      }
      return responseArray;
    },
  },
  sampleEmit,
};
