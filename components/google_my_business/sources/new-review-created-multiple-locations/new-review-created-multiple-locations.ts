import { defineSource } from "@pipedream/types";
import { BatchGetReviewsParams } from "../../common/requestParams";
import {
  BatchGetReviewsResponse, Review,
} from "../../common/responseSchemas";
import app from "../../app/google_my_business.app";
import common from "../common";

const DOCS_LINK = "https://developers.google.com/my-business/content/review-data#get_reviews_from_multiple_locations";

export default defineSource({
  ...common,
  key: "google_my_business-new-review-created-multiple-locations",
  name: "New Review Created (Multiple Locations)",
  description: `Emit new event for each new review on any of the selected locations [See the documentation](${DOCS_LINK})`,
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    location: {
      propDefinition: [
        app,
        "location",
      ],
      type: "string[]",
      label: "Location Names",
      description: "One or more location IDs or full resource names to monitor for new reviews, e.g. `123456789` or `locations/123456789`. Use **List Locations** to find valid location IDs for the account.",
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData();
    },
  },
  methods: {
    ...common.methods,
    async getItems(): Promise<Review[]> {
      const {
        account, location,
      } = this;

      const accountId = this.app.getCleanName(account);

      const params: BatchGetReviewsParams = {
        account: accountId,
        data: {
          locationNames: location?.map((locationName: string) =>
            `accounts/${accountId}/locations/${this.app.getCleanName(locationName)}`),
        },
      };

      const response: BatchGetReviewsResponse = await this.app.batchGetReviews(params);

      return response?.locationReviews?.map((item) => item.review) ?? [];
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
