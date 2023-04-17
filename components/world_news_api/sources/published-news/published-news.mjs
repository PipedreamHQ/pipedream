import app from "../../world_news_api.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import {
  getCommaSeparatedListFromArray,
  formatDateTime,
  getCurrentDateTimeMinusHours,
} from "../../common/helpers.mjs";

export default {
  // eslint-disable-next-line pipedream/source-name
  name: "Published News",
  description: "Emit new event whenever recent news are published. Calling this endpoint requires 1 point per page, up to 1000 news. [See the docs here](https://worldnewsapi.com/docs/#Search-News)",
  key: "world_news_api-published-news",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    timer: {
      label: "Polling Interval",
      description: "Pipedream will poll the World News API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
    sourceCountries: {
      propDefinition: [
        app,
        "sourceCountries",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    minSentiment: {
      propDefinition: [
        app,
        "minSentiment",
      ],
    },
    maxSentiment: {
      propDefinition: [
        app,
        "maxSentiment",
      ],
    },
    newsSources: {
      propDefinition: [
        app,
        "newsSources",
      ],
    },
    authors: {
      propDefinition: [
        app,
        "authors",
      ],
    },
    entities: {
      propDefinition: [
        app,
        "entities",
      ],
    },
    locationFilter: {
      propDefinition: [
        app,
        "locationFilter",
      ],
    },
  },
  methods: {
    emit(data) {
      this.$emit(data, {
        id: data.id,
        summary: data.title,
        ts: Date.now(),
      });
    },
    setEarliestPublishedDate(date) {
      this.db.set("earliestPublishedDate", date);
    },
    getEarliestPublishedDate() {
      const earliestPublishedDate = this.db.get("earliestPublishedDate");
      return earliestPublishedDate
        ? formatDateTime(new Date(earliestPublishedDate))
        : formatDateTime(getCurrentDateTimeMinusHours(6));
    },
    async getCurrentPageRawData(offset, itemsPerPage) {
      const params = {
        "text": this.text || undefined,
        "source-countries": getCommaSeparatedListFromArray(this.sourceCountries),
        "language": this.language || undefined,
        "min-sentiment": this.minSentiment || undefined,
        "max-sentiment": this.maxSentiment || undefined,
        "earliest-publish-date": this.getEarliestPublishedDate(),
        "news-sources": getCommaSeparatedListFromArray(this.newsSources),
        "authors": getCommaSeparatedListFromArray(this.authors),
        "entities": getCommaSeparatedListFromArray(this.entities),
        "location-filter": this.locationFilter || undefined,
        "offset": offset,
        "number": itemsPerPage,
        "sort": "publish-time",
        "sort-direction": "DESC",
      };
      const res = await this.app.searchNews(params);
      return res;
    },
    async fetchNews(itemsPerPage, maxCallsPerExecution) {
      const ITEMS_PER_PAGE = itemsPerPage ?? 100;
      const MAX_CALLS_PER_EXECUTION = maxCallsPerExecution ?? 3;
      const MAX_OFFSET = MAX_CALLS_PER_EXECUTION * ITEMS_PER_PAGE;
      console.log(`Fetching news... (up to ${MAX_OFFSET}),`);

      const newsToEmit = [];
      let offset = 0;

      do {
        const res = await this.getCurrentPageRawData(offset, ITEMS_PER_PAGE);
        if (res.news.length === 0) {
          break;
        }

        for (const news of res.news) {
          newsToEmit.push(news);
        }
        offset += ITEMS_PER_PAGE;
      } while (offset < MAX_OFFSET);

      // Order by news.publishTime manually because API is not respecting order
      newsToEmit.sort((a, b) => {
        return new Date(a.publish_date) - new Date(b.publish_date);
      });
      for (const news of newsToEmit) {
        this.emit(news);
      }

      if (newsToEmit.length > 0) {
        this.setEarliestPublishedDate(newsToEmit[newsToEmit.length - 1].publish_date);
      }
    },
  },
  hooks: {
    async deploy() {
      await this.fetchNews(20, 1);
    },
  },
  async run() {
    await this.fetchNews(100, 3);
  },
};
