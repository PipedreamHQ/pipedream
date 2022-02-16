// legacy_hash_id: a_bKiraz
import { axios } from "@pipedream/platform";

export default {
  key: "jira-get-issue",
  name: "Get Issue",
  description: "Gets the details for an issue.",
  version: "0.1.1",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
    },
    issueIdOrKey: {
      type: "string",
      description: "The ID or key of the issue to get details. If the identifier doesn't match an issue, a case-insensitive search and check for moved issues is performed.",
    },
    fields: {
      type: "string",
      description: "A list of fields to return for the issue. This parameter accepts a comma-separated list. Use it to retrieve a subset of fields.  All fields are returned by default. Allowed values:\n\n`*all` Returns all fields.\n`*navigable` Returns navigable fields.\nAny issue field, prefixed with a minus to exclude, as in `-description `.",
      optional: true,
    },
    fieldsByKeys: {
      type: "boolean",
      description: "Whether `fields` in fields are referenced by keys rather than IDs. This parameter is useful where fields have been added by a connect app and a field's key may differ from its ID.",
      optional: true,
    },
    expand: {
      type: "string",
      optional: true,
    },
    properties: {
      type: "string",
      optional: true,
    },
    updateHistory: {
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
  // First we must make a request to get our the cloud instance ID tied
  // to our connected account, which allows us to construct the correct REST API URL. See Section 3.2 of
  // https://developer.atlassian.com/cloud/jira/platform/oauth-2-authorization-code-grants-3lo-for-apps/
    const resp = await axios($, {
      url: "https://api.atlassian.com/oauth/token/accessible-resources",
      headers: {
        Authorization: `Bearer ${this.jira.$auth.oauth_access_token}`,
      },
    });

    // Assumes the access token has access to a single instance
    const cloudId = resp[0].id;

    // See https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-get
    // for all options
    return await axios($, {
      url: `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${this.issueIdOrKey}`,
      headers: {
        "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
        "Accept": "application/json",
      },
      data: {
        fields: this.fields,
        fieldsByKeys: this.fieldsByKeys,
        expand: this.expand,
        properties: this.properties,
        updateHistory: this.updateHistory,
      },
    });
  },
};
