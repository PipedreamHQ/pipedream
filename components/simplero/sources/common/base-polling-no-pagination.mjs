import base from "./base-polling.mjs";

export default {
  ...base,
  methods: {
    ...base.methods,
    async processEvents(maxResults = false) {
      const lastId = this._getLastId();
      const fn = this.getFunction();

      const responseArray = (await fn())
        .filter((item) => item.id > lastId)
        .sort((a, b) => b.id - a.id);

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastId(responseArray[0].id);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: Date.parse(item.created_at || new Date()),
        });
      }
    },
  },
};

