import { defineSource } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { ListReviewsParams } from "../../common/requestParams";

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
      // on deploy, fetch all reviews to store in db
      // but emit event only for the latest 10
      await this.getAndProcessData();
    },
  },
  methods: {
    setSavedItems(value: string[]) {
      this.db.set("savedItems", value);
    },
    getSavedItems(): string[] {
      return this.db.get("savedItems");
    },
    async getAndProcessData() {
      const {
        account, location,
      } = this;

      const params: ListReviewsParams = {
        account,
        location,
      };

      const response = await this.app.listReviews(params);

      // this.$emit(data, {
      //   id: ts,
      //   summary: `New rate: 1 ${base} = ${amount} ${name}`,
      //   ts,
      // });
    },
  },
  async run() {
    await this.getAndProcessData();
  },
});
