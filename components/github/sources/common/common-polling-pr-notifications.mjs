import common from "./common-polling.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    async getAndProcessData(maxEmits = 0) {
      const savedIds = this._getSavedIds();
      const items = await this.getItems();

      const urlData = new Map();
      let amountEmits = 0;

      const promises = items?.
        filter?.((item) => !savedIds.includes(this.getItemId(item)))
        .map((item) => (async () => {
          if (item?.subject?.notification !== null) {
            const url = item.subject.url;
            if (!urlData.has(url)) {
              urlData.set(url, await this.github.getFromUrl({
                url: item.subject.url,
              }));
            }
            const pullRequest = urlData.get(url);
            if (!maxEmits || (amountEmits < maxEmits)) {
              this.$emit(pullRequest, {
                id: pullRequest.id,
                ...this.getItemMetadata(pullRequest),
              });
              amountEmits++;
            }
          }
          savedIds.push(this.getItemId(item));
        })());

      if (promises?.length) await Promise.allSettled(promises);

      this._setSavedIds(savedIds);
    },
  },
};
