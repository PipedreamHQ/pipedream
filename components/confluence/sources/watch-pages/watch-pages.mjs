import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-watch-pages",
  name: "Watch Pages",
  description: "Emits an event when a page is created or updated in Confluence",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    confluence,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    spaceKey: {
      propDefinition: [
        confluence,
        "spaceKey",
      ],
    },
    pageKey: {
      propDefinition: [
        confluence,
        "pageKey",
      ],
      optional: true,
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, version, title, type, space, history,
      } = data;
      const ts = Date.parse(history.lastUpdated.when);
      return {
        id,
        summary: `${title} ${type} was ${history.lastUpdated.operation}`,
        ts,
      };
    },
  },
  async run() {
    const params = {
      spaceKey: this.spaceKey,
      pageKey: this.pageKey,
    };
    const results = await this.confluence._makeRequest({
      path: `/wiki/rest/api/content?spaceKey=${this.spaceKey}&expand=version,history&limit=50&orderBy=history.lastUpdated`,
    });

    for (const page of results.results) {
      this.$emit(page, this.generateMeta(page));
    }
  },
};
