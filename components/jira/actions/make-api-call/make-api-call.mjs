import jira from "../../jira.app.mjs";

export default {
  key: "jira-make-api-call",
  name: "Make API Call",
  description: "Makes an aribitrary call to Jira API, [See](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/) for all options.",
  version: "0.1.3",
  type: "action",
  props: {
    jira,
    request_method: {
      type: "string",
      label: "Request method",
      description: "Http method to use in the request.",
      options: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
      ],
    },
    relative_url: {
      type: "string",
      label: "Relative url",
      description: "A path relative to Jira cloud, to send the request against, e.g. `/issue`",
    },
    query_string: {
      type: "string",
      label: "Query string",
      description: "Query string of the request.",
      optional: true,
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Headers to be sent in the request.",
      optional: true,
    },
    request_body: {
      type: "object",
      label: "Request body",
      description: "Body of the request.",
      optional: true,
    },
  },
  async run({ $ }) {
    this.query_string = this.query_string || "";
    const response = await this.jira._makeRequest({
      $,
      method: this.request_method,
      path: `${this.relative_url}${this.query_string}`,
      headers: this.headers,
      data: this.request_body,
    });
    $.export("$summary", "Configured request has been sent.");
    return response;
  },
};
