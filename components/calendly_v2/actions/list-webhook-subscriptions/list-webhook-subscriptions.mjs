import calendly from "../../calendly_v2.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "calendly_v2-list-webhook-subscriptions",
  name: "List Webhook Subscriptions",
  description: "Get a list of Webhook Subscriptions for an Organization or User via `GET /webhook_subscriptions`. Requires `organizationUri` when `scope` is `organization`, or `userUri` when `scope` is `user`. Run **List Organization Memberships** first to obtain an organization or user URI. Example: call with `scope` set to `organization` and `organizationUri` set to `https://api.calendly.com/organizations/AAAAAAAAAAAAAAAA` to return that organization's webhook subscriptions. [See the documentation](https://calendly.stoplight.io/docs/api-docs/faac832d7c57d-list-webhook-subscriptions)",
  version: "0.1.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    calendly,
    scope: {
      type: "string",
      label: "Scope",
      description: "Filter the list by organization or user.",
      options: [
        "organization",
        "user",
      ],
    },
    organizationUri: {
      type: "string",
      label: "Organization URI",
      description: "Filters the results by organization URI, such as `https://api.calendly.com/organizations/012345678901234567890`. Required when `scope` is `organization`. Run **List Organization Memberships** first to obtain a valid organization URI.",
      optional: true,
    },
    userUri: {
      type: "string",
      label: "User URI",
      description: "Filters the results by user URI, such as `https://api.calendly.com/users/CAFHCZWDQLKQ73HX`. Required when `scope` is `user`. Run **List Organization Memberships** first to obtain a valid user URI.",
      optional: true,
    },
    count: {
      type: "string",
      label: "Count",
      description: "The number of rows to return.",
      optional: true,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "The token to pass to get the next portion of the collection.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Order results by the specified field and direction. Accepts comma-separated list of {field}:{direction} values. Supported fields are: created_at. Sort direction is specified as: asc, desc.",
      optional: true,
      options: [
        "created_at:asc",
        "created_at:desc",
      ],
    },
  },
  async run({ $ }) {
    if (!this.scope) {
      throw new ConfigurationError("Must provide a scope parameter.");
    }
    if (this.scope === "organization" && !this.organizationUri) {
      throw new ConfigurationError("Must provide organizationUri when scope is organization.");
    }
    if (this.scope === "user" && !this.userUri) {
      throw new ConfigurationError("Must provide userUri when scope is user.");
    }

    const response = await this.calendly.listWebhookSubscriptions({
      scope: this.scope,
      organization: this.organizationUri,
      user: this.userUri,
      count: this.count,
      page_token: this.pageToken,
      sort: this.sort,
    }, $);

    $.export("$summary", `Successfully retrieved webhook subscriptions for ${this.scope} ${this.organizationUri
      ? `and ${this.organizationUri}`
      : this.userUri
        ? `and ${this.userUri}`
        : ""}`);
    return response;
  },
};
