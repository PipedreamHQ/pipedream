import { defineSource } from "@pipedream/types";
import { ListReviewsParams } from "../../common/requestParams";
import {
  ListReviewsResponse, Review,
} from "../../common/responseSchemas";
import common from "../common";

const DOCS_LINK = "https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list";

export default defineSource({
  ...common,
  key: "google_my_business-new-review-created",
  name: "New Review Created",
  description: `Emit new event for each new review on a location [See the documentation](${DOCS_LINK})`,
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems(): Promise<Review[]> {
      const {
        account, location,
      } = this;

      const params: ListReviewsParams = {
        account,
        location,
      };

      const response: ListReviewsResponse = await this.app.listReviews(params);

      return response?.reviews ?? [];
    },
    getSummary({ comment }: Review) {
      return `New Review${comment
        ? `: "${comment.length > 50
          ? comment.slice(0, 45) + "[...]"
          : comment}"`
        : ""}`;
    },
  },
});
