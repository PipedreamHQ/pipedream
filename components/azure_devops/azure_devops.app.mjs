// x-pd-ai: optimized
import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import {
  ACCOUNTS_BASE_URL,
  ANALYTICS_BASE_URL,
  ANALYTICS_ODATA_VERSION,
  BASE_URL,
  CONTINUATION_TOKEN_HEADER,
  DEFAULT_API_VERSION,
  DEFAULT_LIMIT,
  GIT_VERSION_TYPE_OPTIONS,
  GRAPH_API_VERSION,
  JSON_PATCH_CONTENT_TYPE,
  LEGACY_API_VERSION,
  MAX_LIMIT,
  PULL_REQUEST_STATUS_OPTIONS,
  VSRM_BASE_URL,
  VSSPS_BASE_URL,
  WORK_ITEM_COMMENTS_API_VERSION,
  WORK_ITEM_EXPAND_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "azure_devops",
  propDefinitions: {
    organizationName: {
      type: "string",
      label: "Organization",
      description: "Name of the organization",
      async options() {
        const accounts = await this.listAccounts();
        return accounts?.map((org) => org.accountName);
      },
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Event type to receive events for",
      async options({ organization }) {
        const types = await this.listEventTypes(organization);
        return types?.map((type) => type.id);
      },
    },
    project: {
      type: "string",
      label: "Project",
      description: "Project ID or project name. Run the **List Projects** action first to obtain valid values.",
    },
    teamId: {
      type: "string",
      label: "Team",
      description: "Team ID or team name. Run the **List Teams** action first to obtain valid values.",
    },
    iterationId: {
      type: "string",
      label: "Iteration",
      description: "GUID of the team iteration. Run the **List Team Iterations** action first to obtain valid values.",
    },
    repositoryId: {
      type: "string",
      label: "Repository",
      description: "Repository ID or repository name. Run the **List Repositories** action first to obtain valid values.",
    },
    pullRequestId: {
      type: "integer",
      label: "Pull Request ID",
      description: "Numeric ID of the pull request. Run the **List Pull Requests** action first to obtain valid values.",
    },
    pullRequestTitle: {
      type: "string",
      label: "Title",
      description: "Title of the pull request (max 400 chars)",
    },
    pullRequestDescription: {
      type: "string",
      label: "Description",
      description: "Description of the pull request (max 4000 chars)",
    },
    pullRequestStatus: {
      type: "string",
      label: "Status",
      description: "Status of the pull request",
      options: PULL_REQUEST_STATUS_OPTIONS,
    },
    targetRefName: {
      type: "string",
      label: "Target Branch",
      description: "Fully qualified name of the branch the pull request merges into, e.g. `refs/heads/main`. Run the **List Branches And Tags** action first to obtain valid values.",
    },
    workItemId: {
      type: "integer",
      label: "Work Item ID",
      description: "Numeric ID of the work item. Run the **Query Work Items (WIQL)** action first to obtain valid values.",
    },
    workItemType: {
      type: "string",
      label: "Work Item Type",
      description: "Work item type, e.g. `Bug`, `Task`, `User Story`. Run the **List Work Item Types** action first to obtain valid values.",
    },
    workItemTitle: {
      type: "string",
      label: "Title",
      description: "Title of the work item (max 255 chars)",
    },
    workItemDescription: {
      type: "string",
      label: "Description",
      description: "Description of the work item. HTML is supported.",
    },
    assignedTo: {
      type: "string",
      label: "Assigned To",
      description: "Email address or display name of the user to assign the work item to. Run the **List Users** action first to obtain valid values.",
    },
    areaPath: {
      type: "string",
      label: "Area Path",
      description: "Area path, e.g. `MyProject\\Team A`. Run the **List Classification Nodes** action first to obtain valid values.",
    },
    iterationPath: {
      type: "string",
      label: "Iteration Path",
      description: "Iteration path, e.g. `MyProject\\Sprint 1`. Run the **List Classification Nodes** action first to obtain valid values.",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to apply to the work item",
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Any other work item fields to set, keyed by reference name. Example: `{ \"Microsoft.VSTS.Common.Priority\": 1 }`. Run the **List Work Item Fields** action first to obtain valid reference names.",
    },
    workItemExpand: {
      type: "string",
      label: "Expand",
      description: "Additional work item attributes to include in the response. Cannot be combined with **Fields**.",
      options: WORK_ITEM_EXPAND_OPTIONS,
    },
    workItemFields: {
      type: "string[]",
      label: "Fields",
      description: "Reference names of the fields to return, e.g. `System.Title`. Returns all fields when omitted. Cannot be combined with **Expand**.",
    },
    asOf: {
      type: "string",
      label: "As Of",
      description: "Return the work item(s) as they looked at this UTC date time, in ISO 8601 format, e.g. `2026-01-31T00:00:00Z`",
    },
    bypassRules: {
      type: "boolean",
      label: "Bypass Rules",
      description: "Do not enforce work item type rules on this change. Requires membership of the Project Collection Service Accounts group.",
    },
    suppressNotifications: {
      type: "boolean",
      label: "Suppress Notifications",
      description: "Do not fire any notifications for this change",
    },
    validateOnly: {
      type: "boolean",
      label: "Validate Only",
      description: "Validate the change without saving the work item",
    },
    commentText: {
      type: "string",
      label: "Comment",
      description: "Text of the comment. Markdown is supported.",
    },
    wikiComment: {
      type: "string",
      label: "Comment",
      description: "Message recorded against the wiki commit this change creates",
      optional: true,
    },
    branchName: {
      type: "string",
      label: "Branch",
      description: "Branch name without the `refs/heads/` prefix, e.g. `main`",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content to write. Replaces what is there rather than appending to it.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the resource",
      optional: true,
    },
    includeLinks: {
      type: "boolean",
      label: "Include Links",
      description: "Include reference links in each returned item",
      optional: true,
    },
    isDraft: {
      type: "boolean",
      label: "Is Draft",
      description: "Create the resource in a draft state rather than publishing it",
      optional: true,
    },
    reviewerId: {
      type: "string",
      label: "Reviewer ID",
      description: "Identity GUID of a reviewer, e.g. `d6245f20-2af8-44f4-9451-8107cb2767db`. Run the **List Users** action first to obtain valid values.",
    },
    commitId: {
      type: "string",
      label: "Commit ID",
      description: "Full 40-character SHA of the commit. Run the **List Commits** action first to obtain valid values.",
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "Repository-relative path, e.g. `/src/index.js`",
    },
    gitVersion: {
      type: "string",
      label: "Version",
      description: "Branch name, tag name or commit SHA to read from. Defaults to the repository's default branch.",
    },
    gitVersionType: {
      type: "string",
      label: "Version Type",
      description: "How **Version** is interpreted. Defaults to `branch`.",
      options: GIT_VERSION_TYPE_OPTIONS,
    },
    buildId: {
      type: "integer",
      label: "Build ID",
      description: "Numeric ID of the build. Run the **List Builds** action first to obtain valid values.",
    },
    buildDefinitionId: {
      type: "integer",
      label: "Build Definition ID",
      description: "Numeric ID of the build definition. Run the **List Build Definitions** action first to obtain valid values.",
    },
    pipelineId: {
      type: "integer",
      label: "Pipeline ID",
      description: "Numeric ID of the pipeline. Run the **List Pipelines** action first to obtain valid values.",
    },
    releaseDefinitionId: {
      type: "integer",
      label: "Release Definition ID",
      description: "Numeric ID of the release definition. Run the **List Release Definitions** action first to obtain valid values.",
    },
    releaseId: {
      type: "integer",
      label: "Release ID",
      description: "Numeric ID of the release. Run the **List Releases** action first to obtain valid values.",
    },
    wikiIdentifier: {
      type: "string",
      label: "Wiki",
      description: "Wiki ID or wiki name. Run the **List Wikis** action first to obtain valid values.",
    },
    wikiPagePath: {
      type: "string",
      label: "Page Path",
      description: "Wiki page path, e.g. `/Home` or `/Guides/Onboarding`",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of results to return (1-${MAX_LIMIT})`,
      min: 1,
      max: MAX_LIMIT,
      default: DEFAULT_LIMIT,
      optional: true,
    },
    skip: {
      type: "integer",
      label: "Skip",
      description: "Number of results to skip before returning matches. Use with **Limit** to page through results.",
      min: 0,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return BASE_URL;
    },
    _headers(useOAuth) {
      const token = useOAuth
        ? this._oauthAccessToken()
        : this._personalAccessToken();
      if (!token && !useOAuth) {
        throw new ConfigurationError("Azure DevOps Personal Access Token is required for this operation. Add it to your Azure DevOps connection.");
      }
      const basicAuth = Buffer.from(`${this._oauthUid()}:${token}`).toString("base64");
      return {
        Authorization: `Basic ${basicAuth}`,
      };
    },
    _oauthAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _oauthUid() {
      return this.$auth.oauth_uid;
    },
    _personalAccessToken() {
      return this.$auth.personal_access_token;
    },
    async _makeRequest(args = {}) {
      const {
        $ = this,
        url,
        path,
        baseUrl = this._baseUrl(),
        apiVersion = DEFAULT_API_VERSION,
        useOAuth = false,
        headers,
        params,
        ...otherArgs
      } = args;
      const config = {
        url: url || `${baseUrl}${path}`,
        headers: {
          ...this._headers(useOAuth),
          ...headers,
        },
        params: apiVersion
          ? {
            ...params,
            "api-version": apiVersion,
          }
          : params,
        ...otherArgs,
      };
      try {
        return await axios($, config);
      } catch (error) {
        if (error.response?.status === 401 && !useOAuth) {
          throw new ConfigurationError("Azure DevOps Personal Access Token is required for this operation. Please verify that your personal access token is correct.");
        }
        throw error;
      }
    },
    _orgPath(organization, suffix) {
      return `/${encodeURIComponent(organization)}${suffix}`;
    },
    _projectPath(organization, project, suffix) {
      const scope = project
        ? `/${encodeURIComponent(project)}`
        : "";
      return `/${encodeURIComponent(organization)}${scope}${suffix}`;
    },
    _repoPath(organization, project, repositoryId, suffix) {
      return this._projectPath(
        organization,
        project,
        `/_apis/git/repositories/${encodeURIComponent(repositoryId)}${suffix}`,
      );
    },
    _teamPath(organization, project, team, suffix) {
      return this._projectPath(
        organization,
        project,
        `/${encodeURIComponent(team)}/_apis/work${suffix}`,
      );
    },
    async paginate({
      limit = DEFAULT_LIMIT, fetchPage,
    }) {
      const items = [];
      let continuationToken;
      do {
        const response = await fetchPage({
          continuationToken,
          top: limit - items.length,
        });
        const page = response.data?.value ?? [];
        if (!page.length) {
          break;
        }
        items.push(...page);
        continuationToken = response.headers?.[CONTINUATION_TOKEN_HEADER];
      } while (continuationToken && items.length < limit);
      return items.slice(0, limit);
    },
    async listAccounts(args = {}) {
      const { value } = await this._makeRequest({
        url: `${ACCOUNTS_BASE_URL}/_apis/accounts?memberId=${this._oauthUid()}`,
        apiVersion: LEGACY_API_VERSION,
        useOAuth: true,
        ...args,
      });
      return value;
    },
    async listEventTypes(organization, args = {}) {
      const { value } = await this._makeRequest({
        path: this._orgPath(organization, "/_apis/hooks/publishers/tfs/eventtypes"),
        apiVersion: LEGACY_API_VERSION,
        ...args,
      });
      return value;
    },
    createSubscription(organization, args = {}) {
      return this._makeRequest({
        method: "POST",
        path: this._orgPath(organization, "/_apis/hooks/subscriptions"),
        apiVersion: LEGACY_API_VERSION,
        ...args,
      });
    },
    deleteSubscription(organization, subscriptionId, args = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: this._orgPath(organization, `/_apis/hooks/subscriptions/${subscriptionId}`),
        apiVersion: LEGACY_API_VERSION,
        ...args,
      });
    },
    queryAnalytics({
      organization, project, entitySet, ...args
    }) {
      const scope = project
        ? `/${encodeURIComponent(project)}`
        : "";
      return this._makeRequest({
        url: `${ANALYTICS_BASE_URL}/${encodeURIComponent(organization)}${scope}/_odata/${ANALYTICS_ODATA_VERSION}/${entitySet}`,
        apiVersion: null,
        ...args,
      });
    },
    listProjects({
      organization, ...args
    }) {
      return this._makeRequest({
        path: this._orgPath(organization, "/_apis/projects"),
        ...args,
      });
    },
    getProject({
      organization, projectId, ...args
    }) {
      return this._makeRequest({
        path: this._orgPath(organization, `/_apis/projects/${encodeURIComponent(projectId)}`),
        ...args,
      });
    },
    createProject({
      organization, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: this._orgPath(organization, "/_apis/projects"),
        ...args,
      });
    },
    listProcesses({
      organization, ...args
    }) {
      return this._makeRequest({
        path: this._orgPath(organization, "/_apis/process/processes"),
        ...args,
      });
    },
    listTeams({
      organization, projectId, ...args
    }) {
      return this._makeRequest({
        path: this._orgPath(organization, `/_apis/projects/${encodeURIComponent(projectId)}/teams`),
        ...args,
      });
    },
    getTeam({
      organization, projectId, teamId, ...args
    }) {
      return this._makeRequest({
        path: this._orgPath(
          organization,
          `/_apis/projects/${encodeURIComponent(projectId)}/teams/${encodeURIComponent(teamId)}`,
        ),
        ...args,
      });
    },
    listTeamMembers({
      organization, projectId, teamId, ...args
    }) {
      return this._makeRequest({
        path: this._orgPath(
          organization,
          `/_apis/projects/${encodeURIComponent(projectId)}/teams/${encodeURIComponent(teamId)}/members`,
        ),
        ...args,
      });
    },
    listTeamIterations({
      organization, project, teamId, ...args
    }) {
      return this._makeRequest({
        path: this._teamPath(organization, project, teamId, "/teamsettings/iterations"),
        ...args,
      });
    },
    getTeamIteration({
      organization, project, teamId, iterationId, ...args
    }) {
      return this._makeRequest({
        path: this._teamPath(
          organization,
          project,
          teamId,
          `/teamsettings/iterations/${encodeURIComponent(iterationId)}`,
        ),
        ...args,
      });
    },
    listIterationWorkItems({
      organization, project, teamId, iterationId, ...args
    }) {
      return this._makeRequest({
        path: this._teamPath(
          organization,
          project,
          teamId,
          `/teamsettings/iterations/${encodeURIComponent(iterationId)}/workitems`,
        ),
        ...args,
      });
    },
    listTeamCapacities({
      organization, project, teamId, iterationId, ...args
    }) {
      return this._makeRequest({
        path: this._teamPath(
          organization,
          project,
          teamId,
          `/teamsettings/iterations/${encodeURIComponent(iterationId)}/capacities`,
        ),
        ...args,
      });
    },
    listTeamDaysOff({
      organization, project, teamId, iterationId, ...args
    }) {
      return this._makeRequest({
        path: this._teamPath(
          organization,
          project,
          teamId,
          `/teamsettings/iterations/${encodeURIComponent(iterationId)}/teamdaysoff`,
        ),
        ...args,
      });
    },
    getTeamSettings({
      organization, project, teamId, ...args
    }) {
      return this._makeRequest({
        path: this._teamPath(organization, project, teamId, "/teamsettings"),
        ...args,
      });
    },
    createWorkItem({
      organization, project, workItemType, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: this._projectPath(
          organization,
          project,
          `/_apis/wit/workitems/$${encodeURIComponent(workItemType)}`,
        ),
        headers: {
          "Content-Type": JSON_PATCH_CONTENT_TYPE,
        },
        ...args,
      });
    },
    getWorkItem({
      organization, project, workItemId, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, `/_apis/wit/workitems/${workItemId}`),
        ...args,
      });
    },
    updateWorkItem({
      organization, project, workItemId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: this._projectPath(organization, project, `/_apis/wit/workitems/${workItemId}`),
        headers: {
          "Content-Type": JSON_PATCH_CONTENT_TYPE,
        },
        ...args,
      });
    },
    deleteWorkItem({
      organization, project, workItemId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: this._projectPath(organization, project, `/_apis/wit/workitems/${workItemId}`),
        ...args,
      });
    },
    listWorkItems({
      organization, project, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, "/_apis/wit/workitems"),
        ...args,
      });
    },
    queryWorkItems({
      organization, project, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: this._projectPath(organization, project, "/_apis/wit/wiql"),
        ...args,
      });
    },
    listWorkItemTypes({
      organization, project, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, "/_apis/wit/workitemtypes"),
        ...args,
      });
    },
    listWorkItemFields({
      organization, project, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, "/_apis/wit/fields"),
        ...args,
      });
    },
    listWorkItemRevisions({
      organization, project, workItemId, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(
          organization,
          project,
          `/_apis/wit/workitems/${workItemId}/revisions`,
        ),
        ...args,
      });
    },
    addWorkItemComment({
      organization, project, workItemId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: this._projectPath(
          organization,
          project,
          `/_apis/wit/workItems/${workItemId}/comments`,
        ),
        apiVersion: WORK_ITEM_COMMENTS_API_VERSION,
        ...args,
      });
    },
    listWorkItemComments({
      organization, project, workItemId, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(
          organization,
          project,
          `/_apis/wit/workItems/${workItemId}/comments`,
        ),
        apiVersion: WORK_ITEM_COMMENTS_API_VERSION,
        ...args,
      });
    },
    listClassificationNodes({
      organization, project, structureGroup, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(
          organization,
          project,
          `/_apis/wit/classificationnodes/${structureGroup}`,
        ),
        ...args,
      });
    },
    listRepositories({
      organization, project, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, "/_apis/git/repositories"),
        ...args,
      });
    },
    getRepository({
      organization, project, repositoryId, ...args
    }) {
      return this._makeRequest({
        path: this._repoPath(organization, project, repositoryId, ""),
        ...args,
      });
    },
    createRepository({
      organization, project, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: this._projectPath(organization, project, "/_apis/git/repositories"),
        ...args,
      });
    },
    deleteRepository({
      organization, project, repositoryId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: this._repoPath(organization, project, repositoryId, ""),
        ...args,
      });
    },
    listRefs({
      organization, project, repositoryId, ...args
    }) {
      return this._makeRequest({
        path: this._repoPath(organization, project, repositoryId, "/refs"),
        ...args,
      });
    },
    updateRefs({
      organization, project, repositoryId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: this._repoPath(organization, project, repositoryId, "/refs"),
        ...args,
      });
    },
    listCommits({
      organization, project, repositoryId, ...args
    }) {
      return this._makeRequest({
        path: this._repoPath(organization, project, repositoryId, "/commits"),
        ...args,
      });
    },
    getCommit({
      organization, project, repositoryId, commitId, ...args
    }) {
      return this._makeRequest({
        path: this._repoPath(
          organization,
          project,
          repositoryId,
          `/commits/${encodeURIComponent(commitId)}`,
        ),
        ...args,
      });
    },
    listItems({
      organization, project, repositoryId, ...args
    }) {
      return this._makeRequest({
        path: this._repoPath(organization, project, repositoryId, "/items"),
        ...args,
      });
    },
    createPush({
      organization, project, repositoryId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: this._repoPath(organization, project, repositoryId, "/pushes"),
        ...args,
      });
    },
    listPullRequests({
      organization, project, repositoryId, ...args
    }) {
      return this._makeRequest({
        path: this._repoPath(organization, project, repositoryId, "/pullrequests"),
        ...args,
      });
    },
    getPullRequest({
      organization, project, repositoryId, pullRequestId, ...args
    }) {
      return this._makeRequest({
        path: this._repoPath(organization, project, repositoryId, `/pullrequests/${pullRequestId}`),
        ...args,
      });
    },
    createPullRequest({
      organization, project, repositoryId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: this._repoPath(organization, project, repositoryId, "/pullrequests"),
        ...args,
      });
    },
    updatePullRequest({
      organization, project, repositoryId, pullRequestId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: this._repoPath(organization, project, repositoryId, `/pullrequests/${pullRequestId}`),
        ...args,
      });
    },
    listPullRequestThreads({
      organization, project, repositoryId, pullRequestId, ...args
    }) {
      return this._makeRequest({
        path: this._repoPath(
          organization,
          project,
          repositoryId,
          `/pullRequests/${pullRequestId}/threads`,
        ),
        ...args,
      });
    },
    createPullRequestThread({
      organization, project, repositoryId, pullRequestId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: this._repoPath(
          organization,
          project,
          repositoryId,
          `/pullRequests/${pullRequestId}/threads`,
        ),
        ...args,
      });
    },
    createPullRequestReviewer({
      organization, project, repositoryId, pullRequestId, reviewerId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: this._repoPath(
          organization,
          project,
          repositoryId,
          `/pullRequests/${pullRequestId}/reviewers/${encodeURIComponent(reviewerId)}`,
        ),
        ...args,
      });
    },
    listBuildDefinitions({
      organization, project, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, "/_apis/build/definitions"),
        ...args,
      });
    },
    getBuildDefinition({
      organization, project, definitionId, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, `/_apis/build/definitions/${definitionId}`),
        ...args,
      });
    },
    listBuilds({
      organization, project, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, "/_apis/build/builds"),
        ...args,
      });
    },
    getBuild({
      organization, project, buildId, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, `/_apis/build/builds/${buildId}`),
        ...args,
      });
    },
    queueBuild({
      organization, project, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: this._projectPath(organization, project, "/_apis/build/builds"),
        ...args,
      });
    },
    updateBuild({
      organization, project, buildId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: this._projectPath(organization, project, `/_apis/build/builds/${buildId}`),
        ...args,
      });
    },
    listBuildArtifacts({
      organization, project, buildId, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(
          organization,
          project,
          `/_apis/build/builds/${buildId}/artifacts`,
        ),
        ...args,
      });
    },
    listBuildLogs({
      organization, project, buildId, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, `/_apis/build/builds/${buildId}/logs`),
        ...args,
      });
    },
    listPipelines({
      organization, project, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, "/_apis/pipelines"),
        ...args,
      });
    },
    createPipeline({
      organization, project, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: this._projectPath(organization, project, "/_apis/pipelines"),
        ...args,
      });
    },
    getPipeline({
      organization, project, pipelineId, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, `/_apis/pipelines/${pipelineId}`),
        ...args,
      });
    },
    runPipeline({
      organization, project, pipelineId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: this._projectPath(organization, project, `/_apis/pipelines/${pipelineId}/runs`),
        ...args,
      });
    },
    listPipelineRuns({
      organization, project, pipelineId, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, `/_apis/pipelines/${pipelineId}/runs`),
        ...args,
      });
    },
    getPipelineRun({
      organization, project, pipelineId, runId, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(
          organization,
          project,
          `/_apis/pipelines/${pipelineId}/runs/${runId}`,
        ),
        ...args,
      });
    },
    listReleaseDefinitions({
      organization, project, ...args
    }) {
      return this._makeRequest({
        baseUrl: VSRM_BASE_URL,
        path: this._projectPath(organization, project, "/_apis/release/definitions"),
        ...args,
      });
    },
    listReleases({
      organization, project, ...args
    }) {
      return this._makeRequest({
        baseUrl: VSRM_BASE_URL,
        path: this._projectPath(organization, project, "/_apis/release/releases"),
        ...args,
      });
    },
    getRelease({
      organization, project, releaseId, ...args
    }) {
      return this._makeRequest({
        baseUrl: VSRM_BASE_URL,
        path: this._projectPath(organization, project, `/_apis/release/releases/${releaseId}`),
        ...args,
      });
    },
    createRelease({
      organization, project, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        baseUrl: VSRM_BASE_URL,
        path: this._projectPath(organization, project, "/_apis/release/releases"),
        ...args,
      });
    },
    listGraphUsers({
      organization, ...args
    }) {
      return this._makeRequest({
        baseUrl: VSSPS_BASE_URL,
        path: this._orgPath(organization, "/_apis/graph/users"),
        apiVersion: GRAPH_API_VERSION,
        ...args,
      });
    },
    getGraphUser({
      organization, userDescriptor, ...args
    }) {
      return this._makeRequest({
        baseUrl: VSSPS_BASE_URL,
        path: this._orgPath(
          organization,
          `/_apis/graph/users/${encodeURIComponent(userDescriptor)}`,
        ),
        apiVersion: GRAPH_API_VERSION,
        ...args,
      });
    },
    listGraphGroups({
      organization, ...args
    }) {
      return this._makeRequest({
        baseUrl: VSSPS_BASE_URL,
        path: this._orgPath(organization, "/_apis/graph/groups"),
        apiVersion: GRAPH_API_VERSION,
        ...args,
      });
    },
    listWikis({
      organization, project, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, "/_apis/wiki/wikis"),
        ...args,
      });
    },
    createWiki({
      organization, project, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: this._projectPath(organization, project, "/_apis/wiki/wikis"),
        ...args,
      });
    },
    getWikiPage({
      organization, project, wikiIdentifier, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(
          organization,
          project,
          `/_apis/wiki/wikis/${encodeURIComponent(wikiIdentifier)}/pages`,
        ),
        ...args,
      });
    },
    async getWikiPageVersion(args) {
      try {
        const response = await this.getWikiPage({
          ...args,
          returnFullResponse: true,
        });
        return response.headers?.etag;
      } catch (error) {
        if (error.response?.status === 404) {
          return undefined;
        }
        throw error;
      }
    },
    createOrUpdateWikiPage({
      organization, project, wikiIdentifier, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: this._projectPath(
          organization,
          project,
          `/_apis/wiki/wikis/${encodeURIComponent(wikiIdentifier)}/pages`,
        ),
        ...args,
      });
    },
    deleteWikiPage({
      organization, project, wikiIdentifier, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: this._projectPath(
          organization,
          project,
          `/_apis/wiki/wikis/${encodeURIComponent(wikiIdentifier)}/pages`,
        ),
        ...args,
      });
    },
    listServiceEndpoints({
      organization, project, ...args
    }) {
      return this._makeRequest({
        path: this._projectPath(organization, project, "/_apis/serviceendpoint/endpoints"),
        ...args,
      });
    },
  },
};
