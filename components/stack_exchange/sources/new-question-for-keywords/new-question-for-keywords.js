const stack_exchange = require("../../stack_exchange.app");

module.exports = {
  key: "stack_exchange-new-question-for-specific-keywords",
  name: "New Question for Specific Keywords",
  description:
    "Emits an event when a new question is posted and related to a set of specific keywords",
  version: "0.0.2",
  dedupe: "unique",
  type: "source",
  props: {
    stack_exchange,
    db: "$.service.db",
    siteId: {
      propDefinition: [
        stack_exchange,
        "siteId",
      ],
    },
    keywords: {
      propDefinition: [
        stack_exchange,
        "keywords",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  hooks: {
    async activate() {
      const fromDate = this._getCurrentEpoch();
      this.db.set("fromDate", fromDate);
    },
  },
  methods: {
    _getCurrentEpoch() {
      // The StackExchange API works with Unix epochs in seconds.
      return Math.floor(Date.now() / 1000);
    },
    generateMeta(data) {
      const {
        question_id: id, creation_date: ts, title,
      } = data;
      const summary = `New question: ${title}`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    const fromDate = this.db.get("fromDate");
    const toDate = this._getCurrentEpoch();
    const keywordsQuery = this.keywords.join(",");
    const searchParams = {
      fromDate,
      toDate,
      sort: "creation",
      order: "asc",
      closed: false,
      site: this.siteId,
      q: keywordsQuery,
    };

    const items = this.stack_exchange.advancedSearch(searchParams);
    for await (const item of items) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }

    this.db.set("fromDate", toDate);
  },
};
