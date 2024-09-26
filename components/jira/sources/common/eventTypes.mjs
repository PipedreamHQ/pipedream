export default [
  {
    label: "Issue Created",
    value: "jira:issue_created",
  },
  {
    label: "Issue Updated",
    value: "jira:issue_updated",
  },
  {
    label: "Issue Deleted",
    value: "jira:issue_deleted",
  },
  /* Below events can be added if additional scopes are added.
  For Jira Cloud, no other events are possible. The scopes required are;
   - read:issue-details:jira
   - read:comment.property:jira
   - read:comment:jira
   - read:epic:jira-software
   - read:group:jira
   - read:issue.property:jira
   - read:issue-type:jira
   - read:project-role:jira
   - read:status:jira
   - read:user:jira
  the events;
  {
    label: "Comment Created",
    value: "comment_created",
  },
  {
    label: "Comment Updated",
    value: "comment_updated",
  },
  {
    label: "Comment Deleted",
    value: "comment_deleted",
  },
  {
    label: "Issue Property Set",
    value: "issue_property_set",
  },
  {
    label: "Issue Property Deleted",
    value: "issue_property_deleted",
  },
  */
];
