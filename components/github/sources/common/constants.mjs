export default {
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
      fnName: "getCommitComments",
    },
    {
      label: "A Git branch or tag is created",
      value: "create",
      fnName: "getBranches",
    },
    {
      label: "A Git branch or tag is deleted",
      value: "delete",
    },
    {
      label: "A deploy key is added or removed from a repository",
      value: "deploy_key",
      fnName: "getDeploymentKeys",
    },
    {
      label: "A deployment is created",
      value: "deployment_status",
      fnName: "getDeployments",
    },
    {
      label: "Activity related to a discussion",
      value: "discussion",
      fnName: "getDiscussions",
    },
    {
      label: "Activity related to a comment in a discussion",
      value: "discussion_comment",
      fnName: "getDiscussionComments",
    },
    {
      label: "A user forks a repository",
      value: "fork",
      fnName: "getForks",
    },
    {
      label: "A wiki page is created or updated",
      value: "gollum",
    },
    {
      label: "Activity related to an issue or pull request comment",
      value: "issue_comment",
      fnName: "getIssueComments",
    },
    {
      label: "Activity related to an issue",
      value: "issues",
      fnName: "getRepositoryIssues",
    },
    {
      label: "Activity related to a label",
      value: "label",
      fnName: "getRepositoryLabels",
    },
    {
      label: "Activity related to repository collaborators",
      value: "member",
      fnName: "getRepositoryCollaborators",
    },
    {
      label: "The webhook this event is configured on was deleted",
      value: "meta",
    },
    {
      label: "Activity related to milestones",
      value: "milestone",
      fnName: "getMilestones",
    },
    {
      label: "Activity related to GitHub Packages",
      value: "package",
      fnName: "getOrganizationPackages",
    },
    {
      label: "Activity on attempted build of a GitHub Pages site, whether successful or not",
      value: "page_build",
    },
    {
      label: "Activity related to project boards",
      value: "project",
      fnName: "getProjects",
    },
    {
      label: "Activity related to project cards",
      value: "project_card",
      fnName: "getProjectCards",
    },
    {
      label: "Activity related to columns in a project board",
      value: "project_column",
      fnName: "getProjectColumns",
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
      label: "Activity related to pull request review comments in the pull request's unified diff",
      value: "pull_request_review_comment",
    },
    {
      label: "Activity related to a comment thread on a pull request being marked as resolved or unresolved",
      value: "pull_request_review_thread",
    },
    {
      label: "One or more commits are pushed to a repository branch or tag",
      value: "push",
    },
    {
      label: "Activity related to a release",
      value: "release",
      fnName: "getReleases",
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
      label: "Activity related to security vulnerability alerts in a repository",
      value: "repository_vulnerability_alert",
    },
    {
      label: "Activity related to a repository being starred",
      value: "star",
      fnName: "getStargazers",
    },
    {
      label: "When the status of a Git commit changes",
      value: "status",
      fnName: "getCommitStatuses",
    },
    {
      label: "When a repository is added to a team",
      value: "team_add",
      fnName: "getTeamRepositories",
    },
    {
      label: "When someone stars a repository",
      value: "watch",
      fnName: "getWatchers",
    },
    {
      label: "A GitHub Actions workflow job has been queued, is in progress, or has been completed on a repository",
      value: "workflow_job",
    },
    {
      label: "When a GitHub Actions workflow run is requested or completed",
      value: "workflow_run",
    },
  ],
  REPOSITORY_WEBHOOK_EXCLUDED_EVENTS: [],
  PACKAGE_TYPE: [
    "npm",
    "maven",
    "rubygems",
    "docker",
    "nuget",
    "container",
  ],
  PACKAGE_TYPE_PROPS: [
    "package",
  ],
  ORG_NAME_PROPS: [
    "package",
    "team_add",
    "discussion",
    "discussion_comment",
    "repository",
  ],
  TEAM_PROPS: [
    "team_add",
    "discussion",
    "discussion_comment",
  ],
  COMMIT_PROPS: [
    "status",
  ],
  DISCUSSION_PROPS: [
    "discussion_comment",
  ],
  PROJECT_PROPS: [
    "project_card",
    "project_column",
  ],
  PROJECT_COLUMN_PROPS: [
    "project_card",
  ],
};
