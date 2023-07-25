import { defineSource } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { ListReviewsParams } from "../../common/requestParams";
import { EntityWithCreateTime } from "../../common/responseSchemas";

const DOCS_LINK = "https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list";

export default defineSource({
  key: "google_my_business-new-review-created",
  name: "New Review Created",
  description: `Emit new event for each new review on a location [See the documentation](${DOCS_LINK})`,
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
    account: {
      propDefinition: [
        app,
        "account",
      ],
    },
    location: {
      propDefinition: [
        app,
        "location",
        ({ account }) => ({
          account,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData();
    },
  },
  methods: {
    setLastRun(value: string) {
      this.db.set("lastRun", value);
    },
    getLastRun() {
      const lastRun: string = this.db.get("lastRun");
      return lastRun
        ? new Date(lastRun)
        : null;
    },
    async getItems() {
      const {
        account, location,
      } = this;

      const params: ListReviewsParams = {
        account,
        location,
      };

      return this.app.listReviews(params);
    },
    async getAndProcessData() {
      const lastRun: Date = this.getLastRun();
      const items: EntityWithCreateTime[] = await this.getItems();
      const ts = Date.now() - 30000;
      this.setLastRun(ts);

      const filteredItems = lastRun
        ? items.filter(({ createTime }) => new Date(createTime) >= lastRun)
        : items.slice(-10);

      filteredItems.reverse().forEach((item) => {
        this.$emit(item, {
          id: this.app.getCleanName(item.name),
          summary: this.getSummary(item),
          ts,
        });
      });
    },
  },
  async run() {
    await this.getAndProcessData();
  },
});
