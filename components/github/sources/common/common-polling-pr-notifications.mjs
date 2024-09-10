import common from "./common/common-polling.mjs";

export default {
  ...common,
  async run(maxEmits = 0) {
    const savedIds = this._getSavedIds();
    const items = await this.getItems();

    const allPrData = new Map();

    items?.
      filter?.((item) => !savedIds.includes(this.getItemId(item)))
      .forEach(async (item, index) => {
        if (item?.subject?.notification !== null && ((!maxEmits) || (index < maxEmits))) {
          const url = item.subject.url;
          if (!allPrData.has(url)) {
            allPrData.set(url, await this.github.getFromUrl({
              url: item.subject.url,
            }));
          }
          const pullRequest = allPrData.get(url);
          this.$emit(pullRequest, {
            id: pullRequest.id,
            ...this.getItemMetadata(item),
          });
        }
        savedIds.push(this.getItemId(item));
      });

    this._setSavedIds(savedIds);
  },
};
