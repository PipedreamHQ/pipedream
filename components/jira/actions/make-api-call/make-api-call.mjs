// legacy_hash_id: a_3Li6Mz
import { axios } from "@pipedream/platform";

export default {
  key: "jira-make-api-call",
  name: "Make API Call",
  description: "Makes an aribitrary call to Jira API",
  version: "0.1.1",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
    },
    request_method: {
      type: "string",
      description: "Http method to use in the request.",
      options: [
        "get",
        "post",
        "put",
        "patch",
        "delete",
      ],
    },
    relative_url: {
      type: "string",
      description: "A path relative to Jira cloud, to send the request against.  This must include your cloud instance ID tied to our connected account; see Section 3.2 of [https://developer.atlassian.com/cloud/jira/platform/oauth-2-authorization-code-grants-3lo-for-apps/](https://developer.atlassian.com/cloud/jira/platform/oauth-2-authorization-code-grants-3lo-for-apps/)",
    },
    query_string: {
      type: "string",
      description: "Query string of the request.",
      optional: true,
    },
    headers: {
      type: "object",
      description: "Headers to send in the request.",
    },
    request_body: {
      type: "object",
      description: "Body of the request.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/
  // for all options

    if (!this.request_method || !this.relative_url) {
      throw new Error("Must provide request_method, and relative_url parameters.");
    }

    this.query_string = this.query_string || "";

    return await axios($, {
      method: this.request_method,
      url: `https://api.atlassian.com/${this.relative_url}${this.query_string}`,
      headers: this.headers,
      data: this.request_body,
    });
  },
};
