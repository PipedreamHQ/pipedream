import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import queries from "./common/queries.mjs";
import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import mutations from "./common/mutations.mjs";

const CustomOctokit = Octokit.plugin(paginateRest);

export default {
  type: "app",
  app: "github",
  propDefinitions: {
    orgName: {
      label: "Organization",
      description: "The name of the Github organization. The name is not case sensitive.",
      type: "string",
      async options() {
        const organizations = await this.getOrganizations();

        return organizations.map((organization) => organization.login);
      },
    },
    repoFullname: {
      label: "Repository",
      description: "The name of the repository. The name is not case sensitive",
      type: "string",
      async options({ org }) {
        const repositories = await this.getRepos({
          org,
        });

        return repositories.map((repository) => repository.full_name);
      },
    },
    repoOrg: {
      label: "Organization Repository",
      description: "The repository in a organization",
      type: "string",
      async options({ org }) {
        if (!org) {
          throw new ConfigurationError("Must specify `org` to display repository options.");
        }
        const repositories = await this.getOrgRepos({
          org,
        });
        return repositories.map((repository) => repository.full_name.split("/")[1]);
      },
    },
    project: {
      label: "Project",
      description: "The project in a repository",
      type: "integer",
      async options({ repoFullname }) {
        const projects = await this.getRepositoryProjects({
          repoFullname,
        });

        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    projectV2: {
      label: "Project V2",
      description: "The project (V2) in a repository",
      type: "integer",
      async options({
        prevContext, org, repo,
      }) {
        const cursor = prevContext?.cursor ?? null;

        const {
          projects, nextCursor,
        } = await this.getProjectsV2({
          repoOwner: org,
          repoName: repo,
          cursor,
        });

        if (cursor && projects.length === 0) {
          return [];
        }

        return {
          options: projects.map((project) => ({
            label: project.title,
            value: project.number,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    status: {
      label: "Item Status",
      description: "The status(es) to emit events for. If not specified, events will be emitted for all statuses.",
      type: "string[]",
      async options({
        org, repo, project,
      }) {
        const { options } = await this.getProjectV2StatusField({
          repoOwner: org,
          repoName: repo,
          project,
        });

        return options.map((status) => ({
          label: status.name,
          value: status.id,
        }));
      },
    },
    projectItem: {
      label: "Project (V2) Item",
      description: "The project item to update",
      type: "string",
      async options({
        org, repo, project,
      }) {
        const items = await this.getProjectV2Items({
          repoOwner: org,
          repoName: repo,
          project,
          amount: 100,
        });

        return items.map((status) => ({
          label: status.fieldValueByName?.text ?? status.id,
          value: status.id,
        }));
      },
    },
    labels: {
      label: "Labels",
      description: "The labels",
      type: "string[]",
      async options({ repoFullname }) {
        const labels = await this.getRepositoryLabels({
          repoFullname,
        });

        return labels.map((label) => label.name);
      },
    },
    collaborators: {
      label: "Collaborators",
      description: "The collaborators",
      type: "string[]",
      async options({ repoFullname }) {
        const collaborators = await this.getRepositoryCollaborators({
          repoFullname,
        });

        return collaborators.map((collaborator) => collaborator.login);
      },
    },
    issueNumber: {
      label: "Issue Number",
      description: "The issue number",
      type: "integer",
      async options({ repoFullname }) {
        const issues = await this.getRepositoryIssues({
          repoFullname,
        });

        return issues.map((issue) => ({
          label: issue.title,
          value: +issue.number,
        }));
      },
    },
    branch: {
      label: "Branch",
      description: "Branch to monitor for new commits",
      type: "string",
      async options({
        page, repoFullname,
      }) {
        const branches = await this.getBranches({
          repoFullname,
          page: page + 1,
        });

        return branches.map((branch) => ({
          label: branch.name,
          value: `${branch.commit.sha}/${branch.name}`,
        }));
      },
    },
    pullNumber: {
      type: "integer",
      label: "PR Number",
      description: "A pull request number",
      async options({ repoFullname }) {
        const prs = await this.getRepositoryPullRequests({
          repoFullname,
        });

        return prs.map((pr) => ({
          label: pr.title,
          value: +pr.number,
        }));
      },
    },
    column: {
      label: "Column",
      description: "The column in a project board",
      type: "integer",
      async options({ project }) {
        const columns = await this.getProjectColumns({
          project,
        });

        return columns.map((column) => ({
          label: column.name,
          value: column.id,
        }));
      },
    },
    gistId: {
      label: "Gist Id",
      description: "The Gist Id to perform your action",
      type: "string",
      async options({ page }) {
        const PER_PAGE = 100;
        const gists = await this.getGists({
          per_page: PER_PAGE,
          page: page + 1,
        });

        return gists.map((gist) => ({
          label: gist.description ?? gist.id,
          value: gist.id,
        }));
      },
    },
    teamId: {
      label: "Team Id",
      description: "The id of the team that will be granted access to this repository. This is only valid when creating a repository in an organization.",
      type: "integer",
      async options() {
        const teams = await this.getTeams();
        return teams.map((team) => ({
          label: team.name,
          value: team.id,
        }));
      },
    },
  },
  methods: {
    _baseApiUrl() {
      return "https://api.github.com";
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _client() {
      const client = new CustomOctokit({
        auth: this._accessToken(),
      });
      client.hook.error("request", this.handleRequestException);
      return client;
    },
    async _makeRequest({
      $ = this,
      path,
      headers = {},
      ...args
    } = {}) {
      return axios($, {
        url: `${this._baseApiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
          Accept: "application/vnd.github+json",
          ...headers,
        },
        ...args,
      });
    },
    async graphql(query, opts = {}) {
      return this._client().graphql(query, opts);
    },
    handleRequestException(exception) {
      console.error(exception);
      const status = exception?.status;
      if (status && (status === 404 || status === 403)) {
        throw new ConfigurationError(`The request failed with status "${status}". It's likely that your connected account doesn't have sufficient permissions to execute that request. [See more information here](https://docs.github.com/en/rest/overview/authenticating-to-the-rest-api?apiVersion=2022-11-28#about-authentication).`);
      }
      throw exception;
    },
    async createWebhook({
      repoFullname, data,
    }) {
      const response = await this._client().request(`POST /repos/${repoFullname}/hooks`, data);

      return response.data;
    },
    async createOrgWebhook({
      org, data,
    }) {
      const response = await this._client().request(`POST /orgs/${org}/hooks`, data);

      return response.data;
    },
    async removeWebhook({
      repoFullname, webhookId,
    }) {
      return this._client().request(`DELETE /repos/${repoFullname}/hooks/${webhookId}`, {});
    },
    async removeOrgWebhook({
      org, webhookId,
    }) {
      return this._client().request(`DELETE /orgs/${org}/hooks/${webhookId}`, {});
    },
    async getOrganizations() {
      const response = await this._client().request("GET /user/orgs", {});

      return response.data;
    },
    async getRepos() {
      return this._client().paginate("GET /user/repos", {});
    },
    async getOrgRepos({ org }) {
      return this._client().paginate(`GET /orgs/${org}/repos`, {});
    },
    async getRepo({ repoFullname }) {
      const response = await this._client().request(`GET /repos/${repoFullname}`, {});

      return response.data;
    },
    async getRepoContent({
      repoFullname,
      path,
      mediaType,
    }) {
      return this._makeRequest({
        path: `/repos/${repoFullname}/contents/${path}`,
        ...(mediaType && {
          headers: {
            Accept: mediaType,
          },
        }),
      });
    },
    async getRepositoryLabels({ repoFullname }) {
      return this._client().paginate(`GET /repos/${repoFullname}/labels`, {});
    },
    async getRepositoryCollaborators({ repoFullname }) {
      return this._client().paginate(`GET /repos/${repoFullname}/collaborators`, {});
    },
    async getRepositoryIssues({ repoFullname }) {
      return this._client().paginate(`GET /repos/${repoFullname}/issues`, {
        state: "all",
      });
    },
    async getRepositoryProjects({ repoFullname }) {
      return this._client().paginate(`GET /repos/${repoFullname}/projects`, {});
    },
    async getProjectsV2({
      repoOwner, repoName, cursor,
    }) {
      const response = await this.graphql(repoName
        ? queries.projectsQuery
        : queries.organizationProjectsQuery, {
        repoOwner,
        repoName,
        cursor,
      });
      return {
        projects: response?.repository?.projectsV2?.nodes ??
          response?.organization?.projectsV2?.nodes,
        nextCursor: response?.repository?.projectsV2?.pageInfo?.endCursor ??
          response?.organization?.projectsV2?.pageInfo?.endCursor,
      };
    },
    async getProjectV2StatusField({
      repoOwner, repoName, project,
    }) {
      const response = await this.graphql(repoName ?
        queries.statusFieldsQuery :
        queries.organizationStatusFieldsQuery, {
        repoOwner,
        repoName,
        project,
      });

      return (response.repository ?? response.organization).projectV2?.field;

    },
    async getProjectV2Id({
      repoOwner, repoName, project,
    }) {
      const response = await this.graphql(repoName ?
        queries.repoProjectIdQuery :
        queries.orgProjectIdQuery, {
        repoOwner,
        repoName,
        project,
      });

      return (response.repository ?? response.organization).projectV2?.id;

    },
    async getProjectV2Items({
      repoName, repoOwner, project, amount,
    }) {
      const response = await this.graphql(repoName ?
        queries.projectItemsQuery :
        queries.organizationProjectItemsQuery,
      {
        repoOwner,
        repoName,
        project,
        amount,
      });

      return (response.repository ?? response.organization).projectV2?.items?.nodes;
    },
    async updateProjectV2ItemStatus({
      projectId, itemId, fieldId, value,
    }) {
      return this.graphql(mutations.updateProjectItemMutation, {
        projectId,
        itemId,
        fieldId,
        value,
      });
    },
    async updateProjectV2ItemPosition({
      projectId, itemId,
    }) {
      return this.graphql(mutations.updateProjectItemPositionMutation, {
        projectId,
        itemId,
        afterId: null,
      });
    },
    async getProjectColumns({ project }) {
      return this._client().paginate(`GET /projects/${project}/columns`, {});
    },
    async getGists() {
      return this._client().paginate("GET /gists", {});
    },
    async getTeams() {
      return this._client().paginate("GET /user/teams", {});
    },
    async getFilteredNotifications({
      reason, data,
    }) {
      const notifications = await this._client().paginate("GET /notifications", data);

      if (reason) {
        return notifications.filter((notification) => notification.reason === reason);
      }

      return notifications;
    },
    async getAuthenticatedUser() {
      const response = await this._client().request("GET /user", {});

      return response.data;
    },
    async getFromUrl({ url }) {
      const response = await this._client().request(`GET ${url.replace(this._baseApiUrl(), "")}`, {});

      return response.data;
    },
    async createIssue({
      repoFullname, data,
    }) {
      const response = await this._client().request(`POST /repos/${repoFullname}/issues`, data);

      return response.data;
    },
    async createBranch({
      repoFullname, data,
    }) {
      const response = await this._client().request(`POST /repos/${repoFullname}/git/refs`, data);

      return response.data;
    },
    async createRepository({ data }) {
      const response = await this._client().request("POST /user/repos", data);

      return response.data;
    },
    async createPullRequest({
      repoFullname, data,
    }) {
      const response = await this._client().request(`POST /repos/${repoFullname}/pulls`, data);

      return response.data;
    },
    async getIssue({
      repoFullname, issueNumber,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/issues/${issueNumber}`, {});

      return response.data;
    },
    async updateIssue({
      repoFullname, issueNumber, data,
    }) {
      const response = await this._client().request(`PATCH /repos/${repoFullname}/issues/${issueNumber}`, data);

      return response.data;
    },
    async createIssueComment({
      repoFullname, issueNumber, data,
    }) {
      const response = await this._client().request(`POST /repos/${repoFullname}/issues/${issueNumber}/comments`, data);

      return response.data;
    },
    async getIssueFromProjectCard({
      repoFullname, cardId,
    }) {
      const { data: card } = await this._client().request(`GET /projects/columns/cards/${cardId}`, {});
      if (!card?.content_url) {
        console.log("No issue associated with this card");
        return;
      }
      const issueId = card.content_url.split("/").pop();
      const { data: issue } = await this._client().request(`GET /repos/${repoFullname}/issues/${issueId}`, {});
      return issue;
    },
    async searchIssueAndPullRequests({
      query, maxResults,
    }) {
      let issues = [];

      for await (const response of this._client().paginate.iterator(
        "GET /search/issues",
        {
          q: query,
          per_page: 100,
        },
      )) {
        issues = issues.concat(response.data);

        if (issues.length >= maxResults) {
          break;
        }
      }

      return issues;
    },
    async getRepositoryPullRequests({ repoFullname }) {
      return this._client().paginate(`GET /repos/${repoFullname}/pulls`, {});
    },
    async getPullRequestForCommit({
      repoFullname, sha,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/commits/${sha}/pulls`, {});

      return response.data[0];
    },
    async getReviewsForPullRequest({
      repoFullname, pullNumber,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/pulls/${pullNumber}/reviews`, {});

      return response.data;
    },
    async getCommits({
      repoFullname, ...data
    }) {
      const { data: commits } = await this._client().request(`GET /repos/${repoFullname}/commits`, {
        ...data,
      });
      return commits;
    },
    async getBranches({
      repoFullname, ...data
    }) {
      const { data: branches } = await this._client().request(`GET /repos/${repoFullname}/branches`, {
        ...data,
      });
      return branches;
    },
    async getProjectCards({
      columnId, ...data
    }) {
      const { data: cards } = await this._client().request(`GET /projects/columns/${columnId}/cards`, {
        ...data,
      });
      return cards;
    },
    async createOrUpdateFileContent({
      repoFullname,
      path,
      fileContent,
      commitMessage,
      branch = null,
    }) {
      const data = {
        message: commitMessage,
        content: Buffer.from(fileContent).toString("base64"),
      };
      const fileExists = await this._makeRequest({
        path: `/repos/${repoFullname}/contents/${path}`,
        validateStatus: () => true,
      });
      if (fileExists.sha) {
        console.log("File exists, overwriting.");
        data.sha = fileExists.sha;
      }
      if (branch) {
        data.branch = branch;
      }
      return this._makeRequest({
        path: `/repos/${repoFullname}/contents/${path}`,
        method: "put",
        data: data,
      });
    },
    async createGist(data) {
      return this._makeRequest({
        path: "/gists",
        method: "post",
        data,
      });
    },
    async listGistsFromUser(username, params = {}) {
      return this._makeRequest({
        path: `/users/${username}/gists`,
        params,
      });
    },
    async updateGist(gistId, data) {
      return this._makeRequest({
        path: `/gists/${gistId}`,
        method: "patch",
        data,
      });
    },
    async listReleases({
      repoFullname,
      perPage,
      page,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/releases`, {
        per_page: perPage,
        page: page,
      });

      return response.data;
    },
    async getUserRepoPermissions({
      repoFullname, username,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/collaborators/${username}/permission`, {});

      return response.data;
    },
    async getOrgUserInfo({
      org, username,
    }) {
      const response = await this._client().request(`GET /orgs/${org}/memberships/${username}`, {});

      return response.data;
    },
    async getRepositoryLatestPullRequests({
      repoFullname, ...args
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/pulls`, {
        direction: "desc",
        ...args,
      });

      return response.data;
    },
    async getRepositoryLatestCollaborators({
      repoFullname, ...args
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/collaborators`, {
        ...args,
      });

      return response.data;
    },
    async getRepositoryLatestCommitComments({
      repoFullname, ...args
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/comments`, {
        ...args,
      });

      return response.data;
    },
    async getRepositoryLatestIssues({
      repoFullname, ...args
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/issues`, {
        state: "all",
        ...args,
      });

      return response.data;
    },
    async getRepositoryLatestLabels({
      repoFullname, ...args
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/labels`, {
        ...args,
      });

      return response.data;
    },
    async getDiscussions({ repoFullname }) {
      const [
        repoOwner,
        repoName,
      ] = repoFullname.split("/");
      const response = await this.graphql(queries.discussionsQuery, {
        repoOwner,
        repoName,
      });
      return response?.repository?.discussions.nodes ?? [];
    },
    async getRepositoryForks({
      repoFullname, ...args
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/forks`, {
        ...args,
      });

      return response.data;
    },
    async getRepositoryMilestones({
      repoFullname, ...args
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/milestones`, {
        ...args,
        per_page: 100,
        state: "open",
      });

      return response.data;
    },
    async getRepositoryStargazers({
      repoFullname, ...args
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/stargazers`, {
        ...args,
        per_page: 100,
      });

      return response.data;
    },
  },
};
