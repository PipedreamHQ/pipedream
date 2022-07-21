import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import constants from "./sources/common/constants.mjs";

const CustomOctokit = Octokit.plugin(paginateRest);

export default {
  type: "app",
  app: "github",
  propDefinitions: {
    orgName: {
      label: "Organization",
      description: "Organization name",
      type: "string",
      async options() {
        const organizations = await this.getOrganizations();

        return organizations.map((organization) => organization.login);
      },
    },
    repoFullname: {
      label: "Repository",
      description: "The repository",
      type: "string",
      async options({ org }) {
        const repositories = await this.getRepos({
          org,
        });
        return repositories.map((repository) => repository.full_name);
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
      description: "Branch",
      type: "string",
      async options({ repoFullname }) {
        const branches = await this.getBranches({
          repoFullname,
        });
        return branches.map((branch) => branch.name);
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
    packageType: {
      label: "Package type",
      description: "The type of supported package",
      type: "string",
      options: constants.PACKAGE_TYPE,
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
      return new CustomOctokit({
        auth: this._accessToken(),
      });
    },
    async createWebhook({
      repoFullname, data,
    }) {
      const response = await this._client().request(`POST /repos/${repoFullname}/hooks`, data);

      return response.data;
    },
    async removeWebhook({
      repoFullname, webhookId,
    }) {
      return this._client().request(`DELETE /webhooks/${repoFullname}/hooks/${webhookId}`, {});
    },
    async getOrganizations() {
      const response = await this._client().request("GET /user/orgs", {});

      return response.data;
    },
    async getRepos() {
      return this._client().paginate("GET /user/repos", {});
    },
    async getRepo({ repoFullname }) {
      const response = await this._client().request(`GET /repos/${repoFullname}`, {});

      return response.data;
    },
    async getRepositoryLabels({
      repoFullname, data,
    }) {
      return this._client().paginate(`GET /repos/${repoFullname}/labels`, {
        ...data,
      });
    },
    async getRepositoryCollaborators({
      repoFullname, data,
    }) {
      return this._client().paginate(`GET /repos/${repoFullname}/collaborators`, {
        ...data,
      });
    },
    async getRepositoryIssues({
      repoFullname, data,
    }) {
      return this._client().paginate(`GET /repos/${repoFullname}/issues`, {
        state: "all",
        ...data,
      });
    },
    async getRepositoryProjects({ repoFullname }) {
      return this._client().paginate(`GET /repos/${repoFullname}/projects`, {});
    },
    async getProjectColumns({
      project, data,
    }) {
      return this._client().paginate(`GET /projects/${project}/columns`, {
        ...data,
      });
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
    async getCommits({
      repoFullname,
      data,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/commits`, {
        ...data,
      });

      return response.data;
    },
    async getBranches({
      repoFullname, data,
    }) {
      const branches = await this._client().request(`GET /repos/${repoFullname}/branches`, {
        ...data,
      });
      return branches.data;
    },
    async getCommitComments({
      repoFullname,
      data,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/comments`, data);

      return response.data;
    },
    async getIssueComments({
      repoFullname,
      data,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/issues/comments`, data);

      return response.data;
    },
    async getOrganizationPackages({
      orgName,
      data,
    }) {
      const response = await this._client().request(`GET /orgs/${orgName}/packages`, data);

      return response.data;
    },
    async getMilestones({
      repoFullname,
      data,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/milestones`, data);

      return response.data;
    },
    async getProjects({
      repoFullname,
      data,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/projects`, data);
      return response.data;
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
    async getTeamRepositories({
      orgName, teamSlug, data,
    }) {
      const response = await this._client().request(`GET /orgs/${orgName}/teams/${teamSlug}/repos`, {
        ...data,
      });

      return response.data;
    },
    async getStargazers({
      repoFullname,
      data,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/stargazers`, data);

      return response.data;
    },
    async getWatchers({
      repoFullname,
      data,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/subscribers`, {
        ...data,
      });

      return response.data;
    },
    async getCommitStatuses({
      repoFullname,
      commitId,
      data,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/commits/${commitId}/statuses`, {
        ...data,
      });

      return response.data;
    },
    async getDiscussions({
      orgName, teamSlug, data,
    }) {
      const response = await this._client().request(`GET /orgs/${orgName}/teams/${teamSlug}/discussions`, {
        ...data,
      });

      return response.data;
    },
    async getDiscussionComments({
      orgName, teamSlug, discussionNumber, data,
    }) {
      const response = await this._client().request(`GET /orgs/${orgName}/teams/${teamSlug}/discussions/${discussionNumber}/comments`, {
        ...data,
      });

      return response.data;
    },
    async getProjectCards({
      column, data,
    }) {
      const response = await this._client().request(`GET /projects/columns/${column}/cards`, {
        ...data,
      });

      return response.data;
    },
    async getForks({
      repoFullname, data,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/forks`, {
        ...data,
      });

      return response.data;
    },
    async getDeployments({
      repoFullname, data,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/deployments`, {
        ...data,
      });

      return response.data;
    },
    async getDeploymentKeys({
      repoFullname, data,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/keys`, {
        ...data,
      });

      return response.data;
    },
    async getReleases({
      repoFullname, data,
    }) {
      const response = await this._client().request(`GET /repos/${repoFullname}/releases`, {
        ...data,
      });

      return response.data;
    },
  },
};
