import { defineSource } from "@pipedream/types";
import { ListPostsParams } from "../../common/requestParams";
import { LocalPost } from "../../common/responseSchemas";
import common from "../common";

const DOCS_LINK = "https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts/list";

export default defineSource({
  ...common,
  key: "google_my_business-new-post-created",
  name: "New Post Created",
  description: `Emit new event for each new local post on a location [See the documentation](${DOCS_LINK})`,
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems(): Promise<LocalPost[]> {
      const {
        account, location,
      } = this;

      const params: ListPostsParams = {
        account,
        location,
      };

      return this.app.listPosts(params, false);
    },
    getSummary({ summary }: LocalPost) {
      return `New Post${summary
        ? `: "${summary.length > 50
          ? summary.slice(0, 45) + "[...]"
          : summary}"`
        : ""}`;
    },
  },
});
