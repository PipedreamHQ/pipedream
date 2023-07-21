import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { ListPostsParams } from "../../common/types";

const DOCS_LINK = "https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts/list";
const PAGE_SIZE = 100;

export default defineAction({
  key: "google_my_business-list-posts",
  name: "List Posts",
  description: `Returns a list of local posts associated with a location. [See the documentation](${DOCS_LINK})`,
  version: "0.0.1",
  type: "action",
  props: {
    app,
    parent: {
      type: "string",
      label: "Parent",
      description:
        "The name of the location whose local posts will be listed.",
    },
    maxResults: {
      type: "integer",
      label: "Max Posts",
      description: `Max amount of posts to retrieve. Each request can retrieve up to ${PAGE_SIZE} posts.`,
      optional: true,
      default: PAGE_SIZE,
      min: 1,
      max: PAGE_SIZE * 10,
    },
  },
  async run({ $ }) {
    const { parent, maxResults } = this;
    const params: ListPostsParams = {
      $,
      parent,
      maxPerPage: PAGE_SIZE,
      maxResults,
    };

    const response = await this.app.listPosts(params);

    $.export("$summary", "Success");

    return response;
  },
});
