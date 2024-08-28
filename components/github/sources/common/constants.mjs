export default {
  HISTORICAL_EVENTS: 25,
  PROJECT_ITEM_TYPES: [
    "Issue",
    "PullRequest",
    "DraftIssue",
  ],
  REPOSITORY_WEBHOOK_EVENTS: [
    {
      label: "Activity related to a branch protection rule",
      value: "branch_protection_rule",
    },
    {
      label: "Check run activity has occurred",
      value: "check_run",
    },
    {
      label: "Check suite activity has occurred",
      value: "check_suite",
    },
    {
      label: "Activity related to code scanning alerts in a repository",
      value: "code_scanning_alert",
    },
    {
      label: "A commit comment is created",
      value: "commit_comment",
    },
    {
      label: "A Git branch or tag is created",
      value: "create",
    },
    {
      label: "A Git branch or tag is deleted",
      value: "delete",
    },
    {
      label: "A deploy key is added or removed from a repository",
      value: "deploy_key",
    },
    {
      label: "A deployment is created",
      value: "deployment_status",
    },
    {
      label: "Activity related to a discussion",
      value: "discussion",
    },
    {
      label: "Activity related to a comment in a discussion",
      value: "discussion_comment",
    },
    {
      label: "A user forks a repository",
      value: "fork",
    },
    {
      label: "A wiki page is created or updated",
      value: "gollum",
    },
    {
      label: "Activity related to an issue or pull request comment",
      value: "issue_comment",
    },
    {
      label: "Activity related to an issue",
      value: "issues",
    },
    {
      label: "Activity related to a label",
      value: "label",
    },
    {
      label: "Activity related to repository collaborators",
      value: "member",
    },
    {
      label: "The webhook this event is configured on was deleted",
      value: "meta",
    },
    {
      label: "Activity related to milestones",
      value: "milestone",
    },
    {
      label: "Activity related to GitHub Packages",
      value: "package",
    },
    {
      label:
        "Activity on attempted build of a GitHub Pages site, whether successful or not",
      value: "page_build",
    },
    {
      label: "Activity related to project boards",
      value: "project",
    },
    {
      label: "Activity related to project cards",
      value: "project_card",
    },
    {
      label: "Activity related to columns in a project board",
      value: "project_column",
    },
    {
      label: "When a private repository is made public",
      value: "public",
    },
    {
      label: "Activity related to pull requests",
      value: "pull_request",
    },
    {
      label: "Activity related to pull request reviews",
      value: "pull_request_review",
    },
    {
      label:
        "Activity related to pull request review comments in the pull request's unified diff",
      value: "pull_request_review_comment",
    },
    {
      label:
        "Activity related to a comment thread on a pull request being marked as resolved or unresolved",
      value: "pull_request_review_thread",
    },
    {
      label: "One or more commits are pushed to a repository branch or tag",
      value: "push",
    },
    {
      label: "Activity related to a release",
      value: "release",
    },
    {
      label: "Activity related to a repository",
      value: "repository",
    },
    {
      label: "Activity related to a repository being imported to GitHub",
      value: "repository_import",
    },
    {
      label:
        "Activity related to security vulnerability alerts in a repository",
      value: "repository_vulnerability_alert",
    },
    {
      label: "Activity related to a repository being starred",
      value: "star",
    },
    {
      label: "When the status of a Git commit changes",
      value: "status",
    },
    {
      label: "When a repository is added to a team",
      value: "team_add",
    },
    {
      label: "When someone stars a repository",
      value: "watch",
    },
    {
      label:
        "A GitHub Actions workflow job has been queued, is in progress, or has been completed on a repository",
      value: "workflow_job",
    },
    {
      label: "When a GitHub Actions workflow run is requested or completed",
      value: "workflow_run",
    },
  ],
  EVENT_TYPES_PULL_REQUEST: [
    {
      label: "A pull request was created.",
      value: "opened",
    },
    {
      label: "A pull request was closed.",
      value: "closed",
    },
    {
      label: "A previously closed pull request was reopened.",
      value: "reopened",
    },
    {
      label: "A draft pull request was marked as ready for review.",
      value: "ready_for_review",
    },
    {
      label: "A pull request was assigned to a user.",
      value: "assigned",
    },
    {
      label: "Auto merge was disabled for a pull request.",
      value: "auto_merge_disabled",
    },
    {
      label: "Auto merge was enabled for a pull request.",
      value: "auto_merge_enabled",
    },
    {
      label: "A pull request was converted to a draft.",
      value: "converted_to_draft",
    },
    {
      label: "A pull request was removed from a milestone.",
      value: "demilestoned",
    },
    {
      label: "A pull request was removed from the merge queue.",
      value: "dequeued",
    },
    {
      label: "The title or body of a pull request was edited.",
      value: "edited",
    },
    {
      label: "A pull request was added to the merge queue.",
      value: "enqueued",
    },
    {
      label: "A label was added to a pull request.",
      value: "labeled",
    },
    {
      label: "Conversation on a pull request was locked.",
      value: "locked",
    },
    {
      label: "A pull request was added to a milestone.",
      value: "milestoned",
    },
    {
      label:
        "A request for review by a person or team was removed from a pull request.",
      value: "review_request_removed",
    },
    {
      label: "Review by a person or team was requested for a pull request.",
      value: "review_requested",
    },
    {
      label:
        "A pull request's head branch was updated. For example, the head branch was updated from the base branch or new commits were pushed to the head branch.",
      value: "synchronize",
    },
    {
      label: "A user was unassigned from a pull request.",
      value: "unassigned",
    },
    {
      label: "A label was removed from a pull request.",
      value: "unlabeled",
    },
    {
      label: "Conversation on a pull request was unlocked.",
      value: "unlocked",
    },
  ],
  EVENT_TYPES_ISSUES: [
    {
      label: "An issue was assigned to a user.",
      value: "assigned",
    },
    {
      label: "An issue was closed.",
      value: "closed",
    },
    {
      label: "An issue was deleted.",
      value: "deleted",
    },
    {
      label: "An issue was removed from a milestone.",
      value: "demilestoned",
    },
    {
      label: "The title or body on an issue was edited.",
      value: "edited",
    },
    {
      label: "A label was added to an issue.",
      value: "labeled",
    },
    {
      label: "Conversation on an issue was locked.",
      value: "locked",
    },
    {
      label: "An issue was added to a milestone.",
      value: "milestoned",
    },
    {
      label:
        "An issue was created. When a closed issue is reopened, the action will be 'reopened' instead.",
      value: "opened",
    },
    {
      label: "An issue was pinned to a repository.",
      value: "pinned",
    },
    {
      label: "A closed issue was reopened.",
      value: "reopened",
    },
    {
      label: "An issue was transferred to another repository.",
      value: "transferred",
    },
    {
      label: "A user was unassigned from an issue.",
      value: "unassigned",
    },
    {
      label: "A label was removed from an issue.",
      value: "unlabeled",
    },
    {
      label: "Conversation on an issue was unlocked.",
      value: "unlocked",
    },
    {
      label: "An issue was unpinned from a repository.",
      value: "unpinned",
    },
  ],
  EVENT_TYPES_MILESTONES: [
    {
      label: "A milestone was closed.",
      value: "closed",
    },
    {
      label: "A milestone was created.",
      value: "created",
    },
    {
      label: "A milestone was deleted.",
      value: "deleted",
    },
    {
      label: "A milestone was edited.",
      value: "edited",
    },
    {
      label: "A milestone was opened.",
      value: "opened",
    },
  ],
};

export const SAMPLE_GITHUB_HEADERS = {
  github_headers: {
    "x-github-delivery": "string",
    "x-github-event": "string",
    "x-github-hook-id": "string",
  },
};
