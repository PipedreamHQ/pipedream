export default {
  key: "github-new-commit",
  name: "New Commit (Instant)",
  description: "Emit new events on new commits to a repo or branch",
  version: "0.1.9",
  type: "source",
  dedupe: "unique",
  props: {
    github: {
      type: "app",
      app: "github",
    },
    http: "$.interface.http",
    db: "$.service.db",
    repoFullname: {
      type: "string",
      label: "Repository",
      description: "The name of the repository. The name is not case sensitive",
      async options({ org }) {
        const repositories = await this.getRepos({
          org,
        });

        return repositories.map((repository) => repository.full_name);
      },
    },
    branch: {
      type: "string",
      label: "Branch",
      description: "Branch to monitor for new commits. Defaults to master",
      optional: true,
      withLabel: true,
      async options({
        page, repoFullname,
      }) {
        const branches = await this.getBranches({
          repoFullname,
          params: {
            page: page + 1,
          },
        });

        return branches.map((branch) => ({
          label: branch.name,
          value: `${branch.commit.sha}/${branch.name}`,
        }));
      },
    },
  },
  hooks: {
    async deploy() {
      if (this.branch) {
        this.branch = {
          label: this.branch.split("/")[1],
          value: this.branch.split("/")[0],
        };
      }

      const commitInfo = await this.github.getCommits({
        repoFullname: this.repoFullname,
        sha: this.branch
          ? this.branch.value
          : undefined,
        per_page: 25,
      });
      const commits = commitInfo.map((info) => ({
        id: info.commit.url.split("/").pop(),
        timestamp: info.commit.committer.date,
        ...info.commit,
      }));
      this.processCommits(commits);
    },
    async activate() {
      const response = await this.github.createWebhook({
        repoFullname: this.repoFullname,
        data: {
          name: "web",
          config: {
            url: this.http.endpoint,
            content_type: "json",
          },
          events: this.getWebhookEvents(),
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.github.removeWebhook({
        repoFullname: this.repoFullname,
        webhookId,
      });
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getWebhookEvents() {
      return [
        "push",
      ];
    },
  },
  async run(event) {
    const { body } = event;

    // skip initial response from Github
    if (body?.zen) {
      console.log(body.zen);
      return;
    }

    const branch = body.ref.split("refs/heads/").pop();
    if (!(!this.branch || branch === this.branch.label)) {
      return;
    }

    for (const commit of body.commits) {
      this.$emit(commit, {
        id: commit.id,
        summary: commit.message,
        ts: Date.parse(commit.timestamp),
      });
    }
  },
};
