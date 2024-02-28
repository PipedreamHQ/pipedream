import reviewflowz from "../../reviewflowz.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "reviewflowz-new-review-instant",
  name: "New Review Instant",
  description: "Emit new event when a review is published on any of your listings.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    reviewflowz: {
      type: "app",
      app: "reviewflowz",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    accountId: {
      propDefinition: [
        reviewflowz,
        "accountId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const reviews = await this.reviewflowz.getReviews({
        accountId: this.accountId,
        paginate: true,
        max: 50,
      });
      reviews.forEach((review) => {
        this.$emit(review, {
          id: review.id,
          summary: `New review published: ${review.id}`,
          ts: Date.parse(review.createdAt),
        });
      });
    },
    async activate() {
      // Logic to create a webhook subscription if necessary
    },
    async deactivate() {
      // Logic to delete the webhook subscription if necessary
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
      body: "",
    });

    const body = event.body;
    if (!body || !body.id) {
      console.log("No review data found in the event body");
      return;
    }

    this.$emit(body, {
      id: body.id,
      summary: `New review published: ${body.id}`,
      ts: Date.parse(body.createdAt) || new Date().getTime(),
    });
  },
};
