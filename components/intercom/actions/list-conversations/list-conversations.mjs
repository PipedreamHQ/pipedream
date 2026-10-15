import {
  CONVERSATIONS_LIST_DEFAULT_PER_PAGE,
  CONVERSATIONS_LIST_MAX_PER_PAGE,
} from "../../common/constants.mjs";
import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-list-conversations",
  name: "List Conversations",
  description: "Lists conversations in your Intercom workspace, most recently updated first (GET /conversations). Use this to discover a conversation's ID before calling **Reply To Conversation**, **Manage A Conversation**, or **Retrieve Conversation** — there is no other way to look one up. Returns a bounded page of conversations, each including `id`, `state`, `created_at`, and the latest message part. If `pages.next.starting_after` is present in the response, call this action again with that cursor in **Starting After** to retrieve the next page. Pass **Fields** (e.g. `[\"id\", \"state\", \"created_at\"]`) to limit each returned conversation to only those keys. Example: leave all props empty to fetch the 20 most recently updated conversations. [See the documentation](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/conversations/listconversations).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    intercom,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: `Maximum number of conversations to return in a single bounded page (min 1, max ${CONVERSATIONS_LIST_MAX_PER_PAGE}). Defaults to ${CONVERSATIONS_LIST_DEFAULT_PER_PAGE}.`,
      min: 1,
      max: CONVERSATIONS_LIST_MAX_PER_PAGE,
      default: CONVERSATIONS_LIST_DEFAULT_PER_PAGE,
      optional: true,
    },
    startingAfter: {
      type: "string",
      label: "Starting After",
      description: "Pagination cursor from a prior call's `pages.next.starting_after` value. Omit to start from the first page.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "When provided, each returned conversation object is limited to only these field names (e.g. `[\"id\", \"state\", \"created_at\"]`). Omit to return the full conversation object.",
      optional: true,
    },
  },
  async run({ $ }) {
    const perPage = this.maxResults ?? CONVERSATIONS_LIST_DEFAULT_PER_PAGE;

    const response = await this.intercom.listConversations({
      $,
      params: {
        per_page: perPage,
        starting_after: this.startingAfter,
      },
    });

    const conversations = response?.conversations ?? [];

    const result = this.fields?.length
      ? {
        ...response,
        conversations: conversations.map((conversation) =>
          Object.fromEntries(this.fields.map((f) => [
            f,
            conversation[f],
          ]))),
      }
      : response;

    $.export("$summary", `Found ${conversations.length} conversation${conversations.length === 1
      ? ""
      : "s"}`);
    return result;
  },
};
