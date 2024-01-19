import common from "../common/base.mjs";

export default {
  ...common,
  key: "stannp-new-recipient-created",
  name: "New Recipient Created",
  description: "Emit new event when a new recipient is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(recipient) {
      return `New Recipient: ${recipient.firstname} ${recipient.lastname}`;
    },
    async startEvent(maxResults = 0) {
      const lastId = this._getLastId();

      const response = this.stannp.paginate({
        fn: this.stannp.listRecipients,
      });

      let responseArray = [];

      for await (const item of response) {
        responseArray.push(item);
      }

      responseArray = responseArray.filter((item) => item.id > lastId).reverse();
      if (maxResults && responseArray.length > maxResults) responseArray.length = maxResults;

      if (responseArray.length) this._setLastId(responseArray[0].id);

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
};
