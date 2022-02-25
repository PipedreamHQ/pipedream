// legacy_hash_id: a_A6iPdN
import { axios } from "@pipedream/platform";

export default {
  key: "splitwise-get-expenses",
  name: "Get expenses",
  description: "Return expenses involving the current user, in reverse chronological order",
  version: "0.1.1",
  type: "action",
  props: {
    splitwise: {
      type: "app",
      app: "splitwise",
    },
    group_id: {
      type: "integer",
      description: "Return expenses for specific group",
      optional: true,
    },
    friend_id: {
      type: "integer",
      description: "Return expenses for a specific friend that are not in any group",
      optional: true,
    },
    dated_after: {
      type: "string",
      description: "ISO 8601 Date time. Return expenses later than this date",
      optional: true,
    },
    dated_before: {
      type: "string",
      description: "ISO 8601 Date time. Return expenses earlier than this date",
      optional: true,
    },
    updated_after: {
      type: "string",
      description: "ISO 8601 Date time. Return expenses updated after this date",
      optional: true,
    },
    updated_before: {
      type: "string",
      description: "ISO 8601 Date time. Return expenses updated before this date",
      optional: true,
    },
    limit: {
      type: "integer",
      description: "How many expenses to fetch. Defaults to 20; set to 0 to fetch all",
      optional: true,
    },
    offset: {
      type: "integer",
      description: "Return expenses starting at limit * offset",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://secure.splitwise.com/api/v3.0/get_expenses",
      headers: {
        Authorization: `Bearer ${this.splitwise.$auth.oauth_access_token}`,
      },
      params: {
        group_id: this.group_id,
        friend_id: this.friend_id,
        dated_after: this.dated_after,
        dated_before: this.dated_before,
        updated_after: this.updated_after,
        updated_before: this.updated_before,
        limit: this.limit,
        offset: this.offset,
      },
    });
  },
};
