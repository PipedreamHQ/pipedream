import queries from "../../common/queries.mjs";
import github from "../../github.app.mjs";
import common from "../common/common-webhook.mjs";

export default {
  key: "github-new-issue-with-status",
  name: "New Issue with Status (Projects V2)",
  description: "Emit new event when a project issue is tagged with a specific status. Currently supports Organization Projects only. [More information here](https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-items-in-your-project/adding-items-to-your-project)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    github,
    org: {
      propDefinition: [
        github,
        "orgName",
      ],
    },
    repo: {
      propDefinition: [
        github,
        "repoFullname",
        (c) => ({
          org: c.org,
        }),
      ],
      async options({ org }) {
        const repositories = await this.getRepos();
        return repositories
          .filter((repository) => repository.full_name.split("/")[0] === org)
          .map((repository) => repository.full_name.split("/")[1]);
      },
    },
    project: {
      propDefinition: [
        github,
        "projectV2",
        (c) => ({
          org: c.org,
          repo: c.repo,
        }),
      ],
    },
    status: {
      propDefinition: [
        github,
        "status",
        (c) => ({
          org: c.org,
          repo: c.repo,
          project: c.project,
        }),
      ],
    },
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {},
    async activate() {
      const response = await this.github.createOrgWebhook({
        org: this.org,
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
      await this.github.removeOrgWebhook({
        org: this.org,
        webhookId,
      });
    },
  },
  methods: {
    ...common.methods,
    getWebhookEvents() {
      return [
        "projects_v2_item",
      ];
    },
    generateMeta(issue, statusName) {
      const { number } = issue;
      const ts = Date.parse(issue.updated_at);
      return {
        id: `${number}-${ts}`,
        summary: `Issue #${number} in ${statusName} status`,
        ts,
      };
    },
    isRelevant(item, issueNumber, statusName) {
      let isRelevant = true;
      let message = "";
      const {
        type,
        isArchived,
        fieldValueByName: { optionId },
      } = item;

      if (type !== "ISSUE") {
        message = `Not an issue: ${type}. Skipping...`;
        isRelevant = false;
      } else if (isArchived) {
        message = "Issue is archived. Skipping...";
        isRelevant = false;
      } else if (optionId !== this.status) {
        message = `Issue #${issueNumber} in ${statusName} status. Skipping...`;
        isRelevant = false;
      }

      if (message) console.log(message);
      return isRelevant;
    },
    async getProjectItem({ nodeId }) {
      const { node } = await this.github.graphql(queries.projectItemQuery, {
        nodeId,
      });
      return node;
    },
  },
  async run({ body: event }) {
    if (event.zen) {
      console.log(event.zen);
      return;
    }

    const item = await this.getProjectItem({
      nodeId: event.projects_v2_item.node_id,
    });

    const issueNumber = item.content.number;
    const statusName = item.fieldValueByName.name;

    if (!this.isRelevant(item, issueNumber, statusName)) {
      return;
    }

    const issue = await this.github.getIssue({
      repoFullname: `${this.org}/${this.repo}`,
      issueNumber,
    });

    console.log(`Emitting issue #${issueNumber}`);
    const meta = this.generateMeta(issue, statusName);
    this.$emit(issue, meta);
  },
};
