import queries from "../../common/queries.mjs";
import common from "../common/common-webhook-orgs.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "github-new-issue-with-status",
  name: "New Issue with Status (Projects V2)",
  description: "Emit new event when a project issue is tagged with a specific status. Currently supports Organization Projects only. [More information here](https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-items-in-your-project/adding-items-to-your-project)",
  version: "0.0.14",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    repo: {
      ...common.props.repo,
      label: common.props.repo.label,
      description: common.props.repo.description,
      optional: true,
    },
    project: {
      propDefinition: [
        common.props.github,
        "projectV2",
        (c) => ({
          org: c.org,
          repo: c?.repo,
        }),
      ],
    },
    status: {
      propDefinition: [
        common.props.github,
        "status",
        (c) => ({
          org: c.org,
          repo: c?.repo,
          project: c.project,
        }),
      ],
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

      if (type !== constants.ISSUE_TYPE) {
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
    async processEvent(event) {
      const item = await this.getProjectItem({
        nodeId: event.projects_v2_item.node_id,
      });

      const issueNumber = item.content.number;
      const statusName = item.fieldValueByName.name;

      if (!this.isRelevant(item, issueNumber, statusName)) {
        return;
      }

      const repoName = this.repo ?? item.content.repository.name;

      const issue = await this.github.getIssue({
        repoFullname: `${this.org}/${repoName}`,
        issueNumber,
      });

      console.log(`Emitting issue #${issueNumber}`);
      const meta = this.generateMeta(issue, statusName);
      this.$emit(issue, meta);
    },
    async loadHistoricalEvents() {
      const response = await this.github.graphql(this.repo ?
        queries.projectItemsQuery :
        queries.organizationProjectItemsQuery,
      {
        repoOwner: this.org,
        repoName: this.repo,
        project: this.project,
        historicalEventsNumber: constants.HISTORICAL_EVENTS,
      });

      const items = response?.repository?.projectV2?.items?.nodes ??
        response?.organization?.projectV2?.items?.nodes;

      for (const node of items) {
        if (node.type === constants.ISSUE_TYPE) {
          const event = {
            projects_v2_item: {
              node_id: node.id,
            },
          };
          await this.processEvent(event);
        }
      }
    },
  },
  async run({ body: event }) {
    if (event.zen) {
      console.log(event.zen);
      return;
    }

    await this.processEvent(event);
  },
};
