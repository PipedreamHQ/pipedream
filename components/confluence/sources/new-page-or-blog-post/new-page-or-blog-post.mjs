import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-new-page-or-blog-post",
  name: "New Page or Blog Post",
  description: "Emits an event whenever a new page or blog post is created in a specified space",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    confluence,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    spaceKey: {
      propDefinition: [
        confluence,
        "spaceKey",
      ],
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.atlassian.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._getBaseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.confluence.$auth.oauth_access_token}`,
        },
      });
    },
    async getNewContent() {
      return this._makeRequest({
        path: `/wiki/rest/api/space/${this.spaceKey}/content`,
      });
    },
    generateMeta(data) {
      const {
        id, title, type, version, history,
      } = data;
      const ts = Date.parse(history.createdDate);
      return {
        id,
        summary: `${title} (${type}) was created`,
        ts,
      };
    },
  },
  async run() {
    const results = await this.getNewContent();
    for (const result of results) {
      const { id } = result;
      const previousId = this.db.get("previousId");
      if (previousId === id) {
        break;
      } else {
        this.$emit(result, this.generateMeta(result));
        this.db.set("previousId", id);
      }
    }
  },
};
