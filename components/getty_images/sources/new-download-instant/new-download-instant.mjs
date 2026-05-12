import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "getty_images-new-download-instant",
  name: "New Download",
  description: "Emit new event each time an image is downloaded from the Getty Images account. Polls the download history on a schedule. [See the documentation](https://developers.gettyimages.com/docs/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    _getLastDate() {
      return this.db.get("lastDate")
        ?? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    },
    generateMeta(download) {
      return {
        id: download.id,
        summary: `Image downloaded: ${download.id}`,
        ts: Date.parse(download.date_downloaded),
      };
    },
    async emitEvent(maxResults) {
      const lastDate = this._getLastDate();
      const now = new Date().toISOString();

      let page = 1;
      let allDownloads = [];
      let hasMore = true;

      while (hasMore) {
        const {
          downloads = [],
          result_count: resultCount = 0,
        } = await this.gettyImages.getDownloads({
          dateFrom: lastDate,
          dateTo: now,
          page,
        });

        allDownloads = allDownloads.concat(downloads);
        hasMore = downloads.length === 100 && page * 100 < resultCount;
        page++;
      }

      if (maxResults) {
        allDownloads = allDownloads.slice(0, maxResults);
      }

      for (const download of allDownloads) {
        this.$emit(download, this.generateMeta(download));
      }

      this._setLastDate(now);
    },
  },
  sampleEmit,
};
