import document360 from "../../document360.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "document360-new-article-in-project-version",
  name: "New Article in Project Version",
  description:
    "Emit new event when a new article is created within a project version. [See the documentation](https://apidocs.document360.com/apidocs/project-version-articles)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    document360,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectVersionId: {
      propDefinition: [
        document360,
        "projectVersionId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessItems(10);
    },
  },
  methods: {
    _getSavedItems() {
      return this.db.get("savedItems") ?? [];
    },
    _setSavedItems(value) {
      this.db.set("savedItems", value);
    },
    async getAndProcessItems(maxItems = 0) {
      const savedItems = this._getSavedItems();
      const response = await this.document360.getArticles(
        this.projectVersionId,
      );
      if (!response?.success) {
        throw new Error(JSON.stringify(response));
      }

      response.data
        ?.filter((item) => !savedItems.includes(item.id))
        .forEach((article, index) => {
          if (!maxItems || index < maxItems) {
            this.$emit(article, {
              id: article.id,
              summary: `New Article: "${article.title}"`,
              ts: Date.now(),
            });
          }
          savedItems.push(article.id);
        });

      this._setSavedItems(savedItems);
    },
  },
  async run() {
    await this.getAndProcessItems();
  },
};
