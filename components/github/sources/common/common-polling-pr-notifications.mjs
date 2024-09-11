import common from "./common-polling.mjs";

export default {
  ...common,
  async run(maxEmits = 0) {
    const savedIds = this._getSavedIds();
    const items = await this.getItems();

    const urlData = new Map();
    let amountEmits = 0;

    items?.
      filter?.((item) => !savedIds.includes(this.getItemId(item)))
      .forEach(async (item) => {
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
              ...this.getItemMetadata(item),
            });
            amountEmits++;
          }
        }
        savedIds.push(this.getItemId(item));
      });

    this._setSavedIds(savedIds);
  },
};
