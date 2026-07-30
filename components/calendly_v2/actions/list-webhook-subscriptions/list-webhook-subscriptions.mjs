// x-pd-ai: optimized
// legacy_hash_id: a_k6ij8Q
import { axios } from "@pipedream/platform";

export default {
  key: "calendly_v2-list-webhook-subscriptions",
  name: "List Webhook Subscriptions",
  description: "Get a list of Webhook Subscriptions for an Organization or User via `GET /webhook_subscriptions`. Requires both `scope` and `organization_uri`; add `user_uri` when `scope` is `user`. Run **List Organization Memberships** first to obtain an organization or user URI. Example: call with `scope` set to `organization` and `organization_uri` set to `https://api.calendly.com/organizations/AAAAAAAAAAAAAAAA` to return that organization's webhook subscriptions. [See the documentation](https://developer.calendly.com/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1webhook_subscriptions/get)",
  version: "0.1.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    calendly_v2: {
      type: "app",
      app: "calendly_v2",
    },
    scope: {
      type: "string",
      description: "Filter the list by organization or user.",
      options: [
        "organization",
        "user",
      ],
    },
    organization_uri: {
      type: "string",
      description: "Filters the results by organization URI, such as `https://api.calendly.com/organizations/012345678901234567890`. Run **List Organization Memberships** first to obtain a valid organization URI.",
    },
    user_uri: {
      type: "string",
      description: "Filters the results by user URI, such as `https://api.calendly.com/users/CAFHCZWDQLKQ73HX`. Required when `scope` is `user`. Run **List Organization Memberships** first to obtain a valid user URI.",
      optional: true,
    },
    count: {
      type: "string",
      description: "The number of rows to return.",
      optional: true,
    },
    page_token: {
      type: "string",
      description: "The token to pass to get the next portion of the collection.",
      optional: true,
    },
    sort: {
      type: "string",
      description: "Order results by the specified field and direction. Accepts comma-separated list of {field}:{direction} values. Supported fields are: created_at. Sort direction is specified as: asc, desc.",
      optional: true,
      options: [
        "created_at:asc",
        "created_at:desc",
      ],
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.calendly.com/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1webhook_subscriptions/get

    if (!this.scope || !this.organization_uri) {
      throw new Error("Must provide scope, and organization_uri parameters.");
    }

    return await axios($, {
      url: "https://api.calendly.com/webhook_subscriptions",
      headers: {
        Authorization: `Bearer ${this.calendly_v2.$auth.oauth_access_token}`,
      },
      params: {
        scope: this.scope,
        user: this.user_uri,
        count: this.count,
        organization: this.organization_uri,
        page_token: this.page_token,
        sort: this.sort,
      },
    });
  },
};
