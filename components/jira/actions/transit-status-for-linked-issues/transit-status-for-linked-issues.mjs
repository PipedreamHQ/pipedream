// legacy_hash_id: a_4rixQ2
import { axios } from "@pipedream/platform";

export default {
  key: "jira-transit-status-for-linked-issues",
  name: "Transit Jira linked issue status",
  description: "Example uses jira automation webhook to retrieve the issue data",
  version: "0.1.1",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
    },
    issuelinks: {
      type: "string",
      description: "`{{event.body.fields.issuelinks}}` from jira webhook post issue body",
    },
    isInward: {
      type: "string",
    },
    linkTypeName: {
      type: "string",
      description: "Could use jira automation interface to set the header",
    },
    cloudId: {
      type: "string",
      description: "Could add previous step as `jira.obtain_jira_instance_id` and use its return value like `{{steps.obtain_jira_instance_id.$return_value}}`\n\nOr set a fixed value once obtained",
    },
    targetTransition: {
      type: "string",
      description: "Could use jira automation interface to set the header",
    },
  },
  async run({ $ }) {
    let issuelinks = this.issuelinks;
    let isInward = (this.isInward == "true");
    let targetIssues = issuelinks.filter((issuelink) => {
      return (issuelink.type.name == this.linkTypeName) && (issuelink.inward == isInward);
    });

    let processed = [];

    for (let issue of targetIssues) {
      let result = {
        issue: issue,
      };
      processed.push(result);
      let transitions = await axios($, {
        method: "GET",
        url: `https://api.atlassian.com/ex/jira/${this.cloudId}/rest/api/3/issue/${issue.issue.id}/transitions`,
        headers: {
          "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });

      let targetTransition = transitions.transitions.find((transition) => transition.name == this.targetTransition);
      if (targetTransition && targetTransition.to.id != issue.issue.fields.status.id) {
        result.transit = await axios($, {
          method: "POST",
          url: `https://api.atlassian.com/ex/jira/${this.cloudId}/rest/api/3/issue/${issue.issue.id}/transitions`,
          headers: {
            "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          data: {
            transition: {
              id: targetTransition.id,
            },
          },
        });
      }
    }
    return {
      processed,
      params: this,
    };
  },
};
