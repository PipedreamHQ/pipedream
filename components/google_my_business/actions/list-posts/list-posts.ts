import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { ListPostsParams } from "../../common/requestParams";
import { POSTS_PAGE_SIZE } from "../../common/constants";

const DOCS_LINK = "https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts/list";

export default defineAction({
  key: "google_my_business-list-posts",
  name: "List Posts",
  description: "List the local posts (updates, events and offers) published on a location."
    + ` Google returns at most ${POSTS_PAGE_SIZE} posts per page, so this action keeps requesting pages until it has \`Max Posts\` posts or there are none left.`
    + " Returns an array of posts. When more posts remain, the token for the next page is exported as `nextPageToken`;"
    + " run the action again with that token in `Page Token` to continue."
    + " To publish a post, use **Create Post**."
    + ` [See the documentation](${DOCS_LINK})`,
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
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
        ({ account }: { account: string; }) => ({
          account,
        }),
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Posts",
      description: `The maximum number of posts to return across all pages, e.g. \`500\`. Defaults to \`${POSTS_PAGE_SIZE}\` (one page).`,
      optional: true,
      default: POSTS_PAGE_SIZE,
      min: 1,
      max: POSTS_PAGE_SIZE * 10,
    },
    pageToken: {
      propDefinition: [
        app,
        "pageToken",
      ],
    },
  },
  async run({ $ }) {
    const {
      account, location, maxResults, pageToken,
    } = this;
    const params: ListPostsParams = {
      $,
      account,
      location,
      maxResults: maxResults ?? POSTS_PAGE_SIZE,
      pageToken,
    };

    const {
      items, nextPageToken,
    } = await this.app.listAllPosts(params);

    if (nextPageToken) {
      $.export("nextPageToken", nextPageToken);
    }
    $.export("$summary", `Successfully listed ${items.length} post${items.length === 1
      ? ""
      : "s"}${nextPageToken
      ? " (more posts are available, see `nextPageToken`)"
      : ""}`);

    return items;
  },
});
