import app from "../../world_news_api.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New News",
  description: "Emit new event when a new news is fetched. Calling this endpoint requires 1 point per page, up to 1000 news.",
  key: "world_news_api-news-event",
  version: "0.0.1",
  type: "source",
  props: {
    app,
    timer: {
      label: "Polling Interval",
      description: "Pipedream will poll the Docusign API on this schedule",
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
    earliestPublishedDate: {
      propDefinition: [
        app,
        "earliestPublishedDate",
      ],
    },
    latestPublishedDate: {
      propDefinition: [
        app,
        "latestPublishedDate",
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
    setLastId(id) {
      this.db.set("lastId", id);
    },
    getLastId() {
      return this.db.get("lastId");
    },
  },
  async run({ $ }) {
    const ITEMS_PER_PAGE = 100;
    const MAX_CALLS_PER_EXECUTION = 10;
    const MAX_OFFSET = MAX_CALLS_PER_EXECUTION * ITEMS_PER_PAGE;
    let offset = 0;

    let available = 0;
    let currentCallLastId;
    const beforeCallLastId = this.getLastId();
    const newsArr = [];
    loop1:
    do {
      const params = {
        "text": this.text || undefined,
        "source-countries": this.sourceCountries?.length > 0
          ? this.sourceCountries.join(",")
          : undefined,
        "language": this.language ?? undefined,
        "min-sentiment": this.minSentiment || undefined,
        "max-sentiment": this.maxSentiment || undefined,
        "earliest-published-date": this.earliestPublishedDate || undefined,
        "latest-published-date": this.latestPublishedDate || undefined,
        "news-sources": this.newsSource?.length > 0
          ? this.newsSource
          : undefined,
        "authors": this.authors?.length > 0
          ? this.authors.join(",")
          : undefined,
        "entities": this.entities?.length > 0
          ? this.entities.join(",")
          : undefined,
        "location-filter": this.locationFilter || undefined,
        "offset": offset,
        "number": ITEMS_PER_PAGE,
        "sort": "publish-time",
        "sort-direction": "DESC",
      };
      const res = await this.app.searchNews(params, $);
      console.log(res);
      available = res.available;

      if (res.news.length === 0) {
        break loop1;
      }

      for (const news of res.news) {
        if (!currentCallLastId) {
          currentCallLastId = news.id;
        }
        if (news.id === beforeCallLastId) {
          break loop1;
        }
        newsArr.unshift(news);
      }
      offset += ITEMS_PER_PAGE;
    } while (offset <= available && offset <= MAX_OFFSET);
    this.setLastId(currentCallLastId);

    for (const news of newsArr.reverse()) {
      this.emit(news);
    }
  },
};
