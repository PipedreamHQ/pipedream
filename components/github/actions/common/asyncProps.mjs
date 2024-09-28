export default {
  assignees: {
    label: "Assignees",
    description: "One or more Users to assign to this issue",
    type: "string[]",
    optional: true,
    options: async () => {
      const collaborators = await this.github.getRepositoryCollaborators({
        repoFullname: this.repoFullname,
      });

      return collaborators.map(({ login }) => login);
    },
  },
  labels: {
    label: "Labels",
    description: "The label(s) to add to the issue",
    type: "string[]",
    optional: true,
    options: async () => {
      const labels = await this.github.getRepositoryLabels({
        repoFullname: this.repoFullname,
      });

      return labels.map(({ name }) => name);
    },
  },
  milestoneNumber: {
    type: "integer",
    label: "Milestone Number",
    description: "The number of a milestone to associate the issue with",
    optional: true,
    options: async () => {
      const items = await this.github.getRepositoryMilestones({
        repoFullname: this.repoFullname,
      });

      return items.map((item) => ({
        label: item.title,
        value: +item.number,
      }));
    },
  },
  pullNumber: {
    type: "integer",
    label: "Pull Request Number",
    description: "The pull request to get reviewers for",
    options: async ({ page }) => {
      const prs = await this.github.getRepositoryPullRequests({
        page: page + 1,
        repoFullname: this.repoFullname,
      });

      return prs.map((pr) => ({
        label: pr.title,
        value: +pr.number,
      }));
    },
  },
};
