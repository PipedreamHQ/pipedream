import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import app from "../../new_york_times.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "new_york_times-new-article",
  name: "New Article Published",
  description: "Emit new event when an article is published.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    facet: {
      type: "boolean",
      label: "Facet",
      description: "Whether to show facet counts.",
      optional: true,
    },
    facetFields: {
      type: "string[]",
      label: "Facet Fields",
      description: "Use facets to view the relative importance of certain fields to a search term, and gain insight about how to best refine your queries and filter your search results.",
      options: [
        "day_of_week",
        "document_type",
        "ingredients",
        "news_desk",
        "pub_month",
        "pub_year",
        "section_name",
        "source",
        "subsection_name",
        "type_of_material",
      ],
      optional: true,
    },
    facetFilter: {
      type: "boolean",
      label: "Facet Filter",
      description: "Have facet counts use filters.",
      optional: true,
    },
    fl: {
      type: "string[]",
      label: "Field List",
      description: "The list of fields to return in the result set.",
      optional: true,
    },
    fq: {
      type: "string",
      label: "Filtered Query",
      description: "A query to filter the search results.",
      optional: true,
    },
    q: {
      type: "string",
      label: "Query",
      description: "Search query term. Search is performed on the article body, headline, and byline.",
      optional: true,
    },
    alert: {
      type: "alert",
      alertType: "info",
      content: "To learn more about filters you can download the [New York Times specification here](https://developer.nytimes.com/portals/api/sites/nyt-devportal/liveportal/apis/articlesearch-product/download_spec).",
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || moment().subtract(1, "day");
    },
    _setLastDate(created) {
      this.db.set("lastDate", created);
    },
    generateMeta(item) {
      return {
        id: item._id,
        summary: `A new article was just published with Id: ${item._id}.`,
        ts: item.pub_date,
      };
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();

      const data = this.app.paginate({
        fn: this.app.searchArticles,
        maxResults,
        params: {
          begin_date: moment(lastDate).format("YYYYMMDD"),
          facet: this.facet,
          facet_fields: this.facetFields && this.facetFields.join(),
          facet_filter: this.facetFilter,
          fl: this.fl && this.fl.join(),
          fq: this.fq,
          q: this.q,
          sort: "newest",
        },
      });

      const responseArray = [];
      for await (const item of data) {
        if (Date.parse(item.pub_date) <= Date.parse(lastDate)) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0].pub_date);

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
